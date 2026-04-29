export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Post, PostStatus, STATUS_LABELS, STATUS_COLORS, STATUS_ORDER } from '@/types'

async function getClient(id: string) {
  const { data } = await supabase
    .from('clients')
    .select('*, posts(*)')
    .eq('id', id)
    .order('hub_number', { referencedTable: 'posts' })
    .order('type', { referencedTable: 'posts' })
    .single()
  return data
}

function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

function HubSection({ hubNumber, posts }: { hubNumber: number; posts: Post[] }) {
  const hubPost = posts.find((p) => p.type === 'hub')
  const spokePosts = posts.filter((p) => p.type === 'spoke')

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Hub {hubNumber}</h3>
        <span className="text-xs text-gray-400">{posts.length} posts</span>
      </div>
      <div className="divide-y divide-gray-100">
        {hubPost && <PostRow post={hubPost} isHub />}
        {spokePosts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
        {posts.length < 6 && (
          <div className="px-5 py-3">
            <Link
              href={`/clients/${posts[0]?.client_id}/posts/new?hub=${hubNumber}`}
              className="text-xs text-gray-400 hover:text-orange-600 transition-colors"
            >
              + Add post to Hub {hubNumber}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function PostRow({ post, isHub }: { post: Post; isHub?: boolean }) {
  return (
    <Link
      href={`/clients/${post.client_id}/posts/${post.id}`}
      className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 transition-colors group"
    >
      <div className="flex-shrink-0 w-1 h-8 rounded-full bg-gray-200 group-hover:bg-orange-400 transition-colors" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isHub && (
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
              HUB
            </span>
          )}
          <p className="text-sm text-gray-800 font-medium truncate">
            {post.seo_title || <span className="text-gray-400 italic">Untitled post</span>}
          </p>
        </div>
        {post.primary_keyword && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{post.primary_keyword}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <StatusBadge status={post.status} />
      </div>
    </Link>
  )
}

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = await getClient(id)
  if (!client) notFound()

  const posts: Post[] = client.posts || []

  // Group by hub_number
  const hubGroups: Record<number, Post[]> = {}
  for (let i = 1; i <= 5; i++) hubGroups[i] = []
  posts.forEach((post) => {
    if (hubGroups[post.hub_number]) {
      hubGroups[post.hub_number].push(post)
    }
  })

  const published = posts.filter((p) => p.status === 'published').length
  const total = 30

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">Dashboard</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600">{client.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {published} / {total} posts published · {posts.length} added
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clients/${id}/posts/new`}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Post
          </Link>
          <Link
            href={`/clients/${id}/edit`}
            className="border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Edit Client
          </Link>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
        {STATUS_ORDER.map((status) => {
          const count = posts.filter((p) => p.status === status).length
          return (
            <div key={status} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-tight">{STATUS_LABELS[status]}</div>
            </div>
          )
        })}
      </div>

      {/* Posts by hub */}
      <div className="space-y-4">
        {Object.entries(hubGroups).map(([hubNum, hubPosts]) => (
          <HubSection
            key={hubNum}
            hubNumber={parseInt(hubNum)}
            posts={hubPosts}
          />
        ))}
      </div>
    </div>
  )
}
