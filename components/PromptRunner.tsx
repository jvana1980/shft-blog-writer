'use client'

import { useState } from 'react'
import { Post, PromptType } from '@/types'
import { PROMPT_LABELS, PROMPT_DESCRIPTIONS, AVAILABLE_PROMPT } from '@/lib/prompt-constants'
import { savePostOutput } from '@/lib/actions'

interface Props {
  post: Post
  clientId: string
}

export default function PromptRunner({ post, clientId }: Props) {
  const availablePrompt = AVAILABLE_PROMPT[post.status]
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [saved, setSaved] = useState(false)

  if (!availablePrompt) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-400">
          No prompt available for this stage. Move the post to the next stage when ready.
        </p>
      </div>
    )
  }

  const promptType = availablePrompt as PromptType

  const outputField: Record<PromptType, 'outline_output' | 'draft_output' | 'outline_output'> = {
    '02': 'outline_output',
    '03': 'draft_output',
    '04': 'outline_output', // ToV update output — save to outline_output as temp; user copies to client edit
  }

  async function runPrompt() {
    setLoading(true)
    setError('')
    setOutput('')
    setSaved(false)

    try {
      const res = await fetch('/api/run-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, promptType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setOutput(data.output)
    } catch {
      setError('Network error — check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  async function saveOutput() {
    const field = promptType === '03' ? 'draft_output' : 'outline_output'
    await savePostOutput(post.id, field, output, clientId)
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      {/* Prompt info */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[#D48B00] bg-[#D48B00]/10 px-2 py-0.5 rounded">
                Prompt {promptType}
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                {PROMPT_LABELS[promptType]}
              </h3>
            </div>
            <p className="text-xs text-gray-500">{PROMPT_DESCRIPTIONS[promptType]}</p>
          </div>
          <button
            onClick={runPrompt}
            disabled={loading}
            className="flex-shrink-0 bg-[#D48B00] hover:bg-[#b87700] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run Prompt
              </>
            )}
          </button>
        </div>

        {promptType === '02' && !post.target_audience && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Heads up:</strong> Target audience and post goal aren't set yet. The outline will be thinner without them. Edit the post metadata to add them before running.
            </p>
          </div>
        )}

        {promptType === '03' && !post.client_brief_answers && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700">
              <strong>Heads up:</strong> No client brief answers saved yet. Add them in the Client Input section below before running the draft.
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Output</span>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={saveOutput}
                disabled={saved}
                className="text-xs text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-3 py-1 rounded-md transition-colors"
              >
                {saved ? 'Saved ✓' : 'Save to Post'}
              </button>
            </div>
          </div>
          <div className="p-5">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
