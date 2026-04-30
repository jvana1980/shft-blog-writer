'use client'

import { useState } from 'react'
import { deletePost } from '@/lib/actions'

interface Props {
  postId: string
  clientId: string
}

export default function DeletePostButton({ postId, clientId }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deletePost(postId, clientId)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          {loading ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-500 hover:text-red-700 transition-colors"
    >
      Delete post
    </button>
  )
}
