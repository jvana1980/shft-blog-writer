'use client'

import { useState } from 'react'
import { pushOutlineToDrive } from '@/lib/actions'

interface Props {
  postId: string
  clientId: string
  existingDocUrl: string | null
}

export default function PushToDriveButton({ postId, clientId, existingDocUrl }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [docUrl, setDocUrl] = useState(existingDocUrl)

  async function handlePush() {
    setLoading(true)
    setError('')
    try {
      const result = await pushOutlineToDrive(postId, clientId)
      if ('error' in result) {
        setError(result.error)
      } else {
        setDocUrl(result.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
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
          disabled={loading}
          className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1 rounded-md transition-colors flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating…
            </>
          ) : docUrl ? (
            'Regenerate in Drive'
          ) : (
            'Push to Drive'
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
