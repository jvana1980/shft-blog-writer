'use client'

import { useState } from 'react'
import { savePostOutput, clearPostOutput } from '@/lib/actions'
import CopyButton from './CopyButton'
import PushToDriveButton from './PushToDriveButton'

interface Props {
  postId: string
  clientId: string
  outline: string
  hasClientDriveFolder: boolean
  existingDocUrl: string | null
}

export default function OutlineEditor({
  postId,
  clientId,
  outline,
  hasClientDriveFolder,
  existingDocUrl,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(outline)
  const [saving, setSaving] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await savePostOutput(postId, 'outline_output', value, clientId)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValue(outline)
    setEditing(false)
  }

  async function handleClear() {
    setClearing(true)
    await clearPostOutput(postId, 'outline_output', clientId)
  }

  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-semibold text-gray-700 flex-shrink-0">Saved Outline</h2>

        {!editing && !confirmClear && (
          <div className="flex items-center gap-3 flex-wrap">
            <CopyButton text={value} />
            {hasClientDriveFolder && (
              <PushToDriveButton
                postId={postId}
                clientId={clientId}
                existingDocUrl={existingDocUrl}
              />
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
            <span className="text-xs text-gray-500">Delete this outline?</span>
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
            rows={32}
            className="w-full text-sm text-gray-800 font-sans leading-relaxed border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#D48B00] resize-y"
          />
        ) : (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
            {value}
          </pre>
        )}
      </div>
    </section>
  )
}
