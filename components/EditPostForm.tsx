'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  post: Record<string, any>
  action: (formData: FormData) => Promise<void>
  cancelHref: string
}

export default function EditPostForm({ post, action, cancelHref }: Props) {
  const [type, setType] = useState<'spoke' | 'hub'>(post.type || 'spoke')

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hub Number</label>
          <select
            name="hub_number"
            defaultValue={post.hub_number}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>Hub {n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'spoke' | 'hub')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          >
            <option value="spoke">Spoke Post</option>
            <option value="hub">Hub Page</option>
          </select>
        </div>

        {type === 'spoke' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Spoke Number</label>
            <select
              name="spoke_number"
              defaultValue={post.spoke_number ?? 1}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>Spoke {n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {[
        { name: 'seo_title', label: 'SEO Title' },
        { name: 'h1_title', label: 'On-Page Title (H1)' },
        { name: 'subtitle', label: 'Subtitle' },
        { name: 'slug', label: 'URL Slug', mono: true },
        { name: 'primary_keyword', label: 'Primary Keyword' },
        { name: 'secondary_keywords', label: 'Secondary Keywords' },
      ].map(({ name, label, mono }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
          <input
            name={name}
            defaultValue={post[name] || ''}
            className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] ${mono ? 'font-mono' : ''}`}
          />
        </div>
      ))}

      {[
        { name: 'meta_description', label: 'Meta Description', rows: 2 },
        { name: 'target_audience', label: 'Target Audience', rows: 3 },
        { name: 'post_goal', label: 'Post Goal', rows: 2 },
      ].map(({ name, label, rows }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
          <textarea
            name={name}
            rows={rows}
            defaultValue={post[name] || ''}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          />
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-[#D48B00] hover:bg-[#b87700] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Save Changes
        </button>
        <Link
          href={cancelHref}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium px-5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
