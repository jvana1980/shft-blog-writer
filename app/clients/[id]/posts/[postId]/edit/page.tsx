export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { updatePostMeta } from '@/lib/actions'
import EditPostForm from '@/components/EditPostForm'

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

  const handleUpdate = updatePostMeta.bind(null, postId, id)

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

      <EditPostForm post={post} action={handleUpdate} cancelHref={`/clients/${id}/posts/${postId}`} />
    </div>
  )
}
