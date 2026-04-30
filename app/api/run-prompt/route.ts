import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { assemblePrompt } from '@/lib/prompts'
import { PromptType } from '@/types'

// Used for outline (prompt 02) and ToV (prompt 04):
// keeps ─── dividers between steps, strips all other markdown
function stripMarkdownOutline(text: string): string {
  return text
    .split('\n')
    .map(line => {
      if (/^[-*_]{3,}\s*$/.test(line)) return '─'.repeat(52)
      return line
        .replace(/^>\s*/g, '')
        .replace(/^#{1,6}\s*/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/\*+/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`/g, '')
        .replace(/~~(.+?)~~/g, '$1')
        .trimEnd()
    })
    .join('\n')
}

// Used for draft (prompt 03):
// converts ## headings → H2: format, removes dividers, strips other markdown
function stripMarkdownDraft(text: string): string {
  return text
    .split('\n')
    .map(line => {
      // Remove horizontal rules entirely so it reads like a blog post
      if (/^[-*_]{3,}\s*$/.test(line)) return ''

      // Convert markdown headings to H2/H3/H4 labels
      const h4 = line.match(/^#{4}\s+(.+)/)
      if (h4) return `H4: ${h4[1].replace(/\*\*/g, '').trim()}`
      const h3 = line.match(/^#{3}\s+(.+)/)
      if (h3) return `H3: ${h3[1].replace(/\*\*/g, '').trim()}`
      const h2 = line.match(/^#{2}\s+(.+)/)
      if (h2) return `H2: ${h2[1].replace(/\*\*/g, '').trim()}`
      const h1 = line.match(/^#\s+(.+)/)
      if (h1) return `H1: ${h1[1].replace(/\*\*/g, '').trim()}`

      return line
        .replace(/^>\s*/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/\*+/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`/g, '')
        .replace(/~~(.+?)~~/g, '$1')
        .trimEnd()
    })
    .join('\n')
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const { postId, promptType } = await req.json() as { postId: string; promptType: PromptType }

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*, clients(*)')
      .eq('id', postId)
      .single()

    if (postError || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const client = post.clients
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { system, user } = assemblePrompt(promptType, post, client)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system,
      messages: [{ role: 'user', content: user }],
    })

    const rawOutput = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    const output = promptType === '03'
      ? stripMarkdownDraft(rawOutput)
      : stripMarkdownOutline(rawOutput)

    await supabase.from('prompt_runs').insert({
      post_id: postId,
      prompt_type: promptType,
      assembled_prompt: user,
      output,
    })

    return NextResponse.json({ output })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
