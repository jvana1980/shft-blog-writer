'use client'

import { useState } from 'react'
import { savePostOutput } from '@/lib/actions'

interface Props {
  postId: string
  clientId: string
  currentAnswers: string | null
}

export default function ClientBriefInput({ postId, clientId, currentAnswers }: Props) {
  const [answers, setAnswers] = useState(currentAnswers || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await savePostOutput(postId, 'client_brief_answers', answers, clientId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Paste the client's filled-in brief here before running Prompt 03.
      </p>
      <textarea
        value={answers}
        onChange={(e) => setAnswers(e.target.value)}
        rows={12}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
        placeholder="Paste client brief answers here..."
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="text-sm font-medium px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white rounded-lg transition-colors"
      >
        {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Answers'}
      </button>
    </div>
  )
}
