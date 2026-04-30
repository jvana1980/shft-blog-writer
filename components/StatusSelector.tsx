'use client'

import { useState } from 'react'
import { PostStatus, STATUS_LABELS, STATUS_ORDER, STATUS_COLORS } from '@/types'
import { updatePostStatus } from '@/lib/actions'

interface Props {
  postId: string
  currentStatus: PostStatus
  clientId: string
}

export default function StatusSelector({ postId, currentStatus, clientId }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatus: PostStatus) {
    setSaving(true)
    setStatus(newStatus)
    await updatePostStatus(postId, newStatus, clientId)
    setSaving(false)
  }

  const currentIndex = STATUS_ORDER.indexOf(status)

  return (
    <div className="space-y-3">
      {/* Current badge */}
      <div className="flex items-center gap-2">
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${STATUS_COLORS[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        {saving && (
          <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
      </div>

      {/* Pipeline steps */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_ORDER.map((s, i) => (
          <button
            key={s}
            onClick={() => handleChange(s)}
            disabled={saving}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              s === status
                ? `${STATUS_COLORS[s]} border-transparent font-semibold`
                : i < currentIndex
                ? 'border-gray-200 text-gray-400 bg-gray-50 hover:border-gray-300'
                : 'border-gray-200 text-gray-500 hover:border-[#D48B00]/50 hover:text-[#D48B00]'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  )
}
