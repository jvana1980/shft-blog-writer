'use client'

import { useState } from 'react'
import { savePostOutput, clearPostOutput, pushDraftToDrive } from '@/lib/actions'
import CopyButton from './CopyButton'

interface Props {
  postId: string
  clientId: string
  draft: string
  hasClientDriveFolder: boolean
  existingDocUrl: string | null
}

// Strip ─── dividers at display time so existing drafts also render cleanly
function cleanDraftDisplay(text: string): string {
  return text
    .split('\n')
    .filter(line => !/^─+$/.test(line.trim()))
    .join('\n')
}

export default function DraftEditor({
  postId,
  clientId,
  draft,
  hasClientDriveFolder,
  existingDocUrl,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(draft)
  const [saving, setSaving] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [pushing, setPushing] = useState(false)
  const [pushError, setPushError] = useState('')
  const [docUrl, setDocUrl] = useState(existingDocUrl)

  async function handleSave() {
    setSaving(true)
    try {
      await savePostOutput(postId, 'draft_output', value, clientId)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValue(draft)
    setEditing(false)
  }

  async function handleClear() {
    setClearing(true)
    await clearPostOutput(postId, 'draft_output', clientId)
  }

  async function handlePush() {
    setPushing(true)
    setPushError('')
    try {
      const result = await pushDraftToDrive(postId, clientId)
      if ('error' in result) {
        setPushError(result.error)
      } else {
        setDocUrl(result.url)
      }
    } catch (err) {
      setPushError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setPushing(false)
    }
  }

  const displayValue = cleanDraftDisplay(value)

  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-700 flex-shrink-0">Saved Draft</h2>

        {!editing && !confirmClear && (
          <div className="flex items-center gap-3 flex-wrap">
            <CopyButton text={displayValue} />
            {hasClientDriveFolder && (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  {docUrl && (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1 rounded-md transition-colors"
                    >
                      Open in Drive →
                    </a>
                  )}
                  <button
                    onClick={handlePush}
                    disabled={pushing}
                    className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1 rounded-md transition-colors flex items-center gap-1.5"
                  >
                    {pushing ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating…
                      </>
                    ) : docUrl ? 'Regenerate in Drive' : 'Push to Drive'}
                  </button>
                </div>
                {pushError && <p className="text-xs text-red-500">{pushError}</p>}
              </div>
            )}
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirmClear(true)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        )}

        {!editing && confirmClear && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Delete this draft?</span>
            <button
              onClick={handleClear}
              disabled={clearing}
              className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-1 rounded-md transition-colors"
            >
              {clearing ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md border border-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md border border-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 px-3 py-1 rounded-md transition-colors"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {editing ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={40}
            className="w-full text-sm text-gray-800 font-sans leading-relaxed border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#D48B00] resize-y"
          />
        ) : (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
            {displayValue}
          </pre>
        )}
      </div>
    </section>
  )
}
