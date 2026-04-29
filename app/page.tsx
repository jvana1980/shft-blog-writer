export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Client, Post, PostStatus, STATUS_LABELS, STATUS_COLORS } from '@/types'

async function getClients() {
  const { data } = await supabase
    .from('clients')
    .select('*, posts(status)')
    .order('created_at', { ascending: true })
  return data as (Client & { posts: { status: PostStatus }[] })[] | null
}

function ProgressBar({ posts }: { posts: { status: PostStatus }[] }) {
  const published = posts.filter((p) => p.status === 'published').length
  const inProgress = posts.filter((p) => p.status !== 'not_started' && p.status !== 'published').length
  const total = 30

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>{published} published</span>
        <span>{posts.length} / {total} added</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${(published / total) * 100}%` }}
        />
        <div
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${(inProgress / total) * 100}%` }}
        />
      </div>
      <div className="flex gap-3 mt-2 text-xs text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Published</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> In progress</span>
      </div>
    </div>
  )
}

function StageBreakdown({ posts }: { posts: { status: PostStatus }[] }) {
  const counts: Partial<Record<PostStatus, number>> = {}
  posts.forEach((p) => {
    counts[p.status] = (counts[p.status] || 0) + 1
  })

  const activeStatuses = Object.entries(counts).filter(
    ([status]) => status !== 'not_started' && status !== 'published'
  )

  if (activeStatuses.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {activeStatuses.map(([status, count]) => (
        <span
          key={status}
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status as PostStatus]}`}
        >
          {count} {STATUS_LABELS[status as PostStatus]}
        </span>
      ))}
    </div>
  )
}

export default async function Dashboard() {
  const clients = await getClients()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clients?.length ?? 0} active {clients?.length === 1 ? 'client' : 'clients'}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Client
        </Link>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-sm">No clients yet.</p>
          <Link
            href="/clients/new"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Add your first client →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {client.name}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">/{client.slug}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <ProgressBar posts={client.posts} />
              <StageBreakdown posts={client.posts} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
