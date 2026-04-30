export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import NewPostForm from '@/components/NewPostForm'

async function getClient(id: string) {
  const { data } = await supabase.from('clients').select('*').eq('id', id).single()
  return data
}

export default async function NewPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ hub?: string }>
}) {
  const { id } = await params
  const { hub } = await searchParams
  const client = await getClient(id)
  if (!client) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/" className="text-gray-400 hover:text-gray-600">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/clients/${id}`} className="text-gray-400 hover:text-gray-600">{client.name}</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">New Post</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Post</h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter the post metadata from the hub/spoke strategy. You can add the target audience and goal now or fill them in before running the outline.
      </p>

      <NewPostForm clientId={id} defaultHub={hub} cancelHref={`/clients/${id}`} />
    </div>
  )
}
