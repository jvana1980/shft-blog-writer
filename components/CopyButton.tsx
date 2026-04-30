'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-gray-400 hover:text-gray-600"
      title="Copy to clipboard"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}
