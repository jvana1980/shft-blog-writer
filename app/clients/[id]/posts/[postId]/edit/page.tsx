export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { updatePostMeta } from '@/lib/actions'

async function getPost(postId: string) {
  const { data } = await supabase.from('posts').select('*, clients(name)').eq('id', postId).single()
  return data
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>
}) {
  const { id, postId } = await params
  const post = await getPost(postId)
  if (!post) notFound()

  async function handleUpdate(formData: FormData) {
    'use server'
    await updatePostMeta(postId, formData, id)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href={`/clients/${id}`} className="text-gray-400 hover:text-gray-600">
          {post.clients?.name}
        </Link>
        <span className="text-gray-300">/</span>
        <Link href={`/clients/${id}/posts/${postId}`} className="text-gray-400 hover:text-gray-600">
          {post.seo_title || 'Post'}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">Edit</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Post Metadata</h1>

      <form action={handleUpdate} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hub Number</label>
            <select
              name="hub_number"
              defaultValue={post.hub_number}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Hub {n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <select
              name="type"
              defaultValue={post.type}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="spoke">Spoke Post</option>
              <option value="hub">Hub Page</option>
            </select>
          </div>
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
              className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${mono ? 'font-mono' : ''}`}
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
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Save Changes
          </button>
          <Link
            href={`/clients/${id}/posts/${postId}`}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium px-5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
