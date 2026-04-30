import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { assemblePrompt } from '@/lib/prompts'
import { PromptType } from '@/types'

function stripMarkdown(text: string): string {
  return text
    .split('\n')
    .map(line => {
      // Convert horizontal rules (---, ***, ___) to empty lines
      if (/^[-*_]{3,}\s*$/.test(line)) return ''
      return line
        .replace(/^>\s*/g, '')            // blockquote markers: >
        .replace(/^#{1,6}\s*/g, '')       // heading markers: # ## ### etc.
        .replace(/\*\*(.+?)\*\*/g, '$1') // bold: **text** → text
        .replace(/__(.+?)__/g, '$1')     // bold: __text__ → text
        .replace(/\*(.+?)\*/g, '$1')     // italic: *text* → text
        .replace(/_(.+?)_/g, '$1')       // italic: _text_ → text
        .replace(/\*+/g, '')             // any remaining asterisks
        .replace(/`([^`]+)`/g, '$1')     // inline code: `code` → code
        .replace(/```[\s\S]*?```/g, '')  // fenced code blocks
        .replace(/`/g, '')               // any remaining backticks
        .replace(/~~(.+?)~~/g, '$1')     // strikethrough: ~~text~~ → text
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

    // Fetch post with client
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

    const output = stripMarkdown(rawOutput)

    // Save run to audit log
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
