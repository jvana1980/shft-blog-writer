'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createPost } from '@/lib/actions'

interface Props {
  clientId: string
  defaultHub?: string
  cancelHref: string
}

export default function NewPostForm({ clientId, defaultHub, cancelHref }: Props) {
  const [type, setType] = useState<'spoke' | 'hub'>('spoke')

  return (
    <form action={createPost} className="space-y-5">
      <input type="hidden" name="client_id" value={clientId} />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hub Number</label>
          <select
            name="hub_number"
            defaultValue={defaultHub || '1'}
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
              defaultValue="1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>Spoke {n}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Title (title tag)</label>
        <input
          name="seo_title"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="e.g. B2B Marketing Channels: How to Pick the Right Ones"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">On-Page Title (H1)</label>
        <input
          name="h1_title"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="e.g. How to Choose the Right B2B Marketing Channels"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
        <input
          name="subtitle"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="e.g. Be in fewer places. Attract better clients."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
        <textarea
          name="meta_description"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="Under 160 characters..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
        <input
          name="slug"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00] font-mono"
          placeholder="e.g. b2b-content-strategy/marketing-channels"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Keyword</label>
        <input
          name="primary_keyword"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="e.g. b2b marketing channels"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary Keywords</label>
        <input
          name="secondary_keywords"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="e.g. best b2b marketing channels (140/9); b2b channel marketing (260/17)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Audience</label>
        <textarea
          name="target_audience"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="Who is this post for? What do they know? What problem are they trying to solve?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Post Goal</label>
        <textarea
          name="post_goal"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D48B00]"
          placeholder="What should the reader do or understand by the end?"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-[#D48B00] hover:bg-[#b87700] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Add Post
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
