export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types'
import StatusSelector from '@/components/StatusSelector'
import PromptRunner from '@/components/PromptRunner'
import ClientBriefInput from '@/components/ClientBriefInput'
import CopyButton from '@/components/CopyButton'
import OutlineEditor from '@/components/OutlineEditor'
import DeletePostButton from '@/components/DeletePostButton'
import CollapsibleSection from '@/components/CollapsibleSection'

async function getPost(postId: string) {
  const { data } = await supabase
    .from('posts')
    .select('*, clients(*)')
    .eq('id', postId)
    .single()
  return data as (Post & { clients: { id: string; name: string; google_drive_folder_id: string | null } }) | null
}

function MetaRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-gray-400 w-36 flex-shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

function StepDivider({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <div className="w-6 h-6 rounded-full bg-[#D48B00]/10 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-[#D48B00]">{step}</span>
      </div>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>
}) {
  const { id, postId } = await params
  const post = await getPost(postId)
  if (!post) notFound()

  const client = post.clients

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/" className="text-gray-400 hover:text-gray-600">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <Link href={`/clients/${id}`} className="text-gray-400 hover:text-gray-600">
          {client.name}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600 truncate max-w-xs">
          {post.seo_title || 'Untitled Post'}
        </span>
      </div>

      {/* Post header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-[#D48B00] bg-[#D48B00]/10 px-2 py-0.5 rounded uppercase">
            {post.type} · Hub {post.hub_number}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {post.seo_title || <span className="text-gray-400 italic">Untitled Post</span>}
        </h1>
        {post.subtitle && (
          <p className="text-gray-500 text-sm italic">{post.subtitle}</p>
        )}
      </div>

      {/* Google Doc link */}
      {post.google_doc_url && (
        <div className="mb-5 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3">
          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
          </svg>
          <span className="text-sm text-blue-700 flex-1">Outline doc in Drive</span>
          <a
            href={post.google_doc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1 rounded-md transition-colors"
          >
            Open in Drive →
          </a>
        </div>
      )}

      {/* Stage — not collapsible */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Stage</h2>
        <StatusSelector postId={post.id} currentStatus={post.status} clientId={id} />
      </section>

      {/* Post Metadata — right under Stage, not collapsible */}
      <div className="h-px bg-gray-200 mt-6 mb-4" />
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Post Metadata</h2>
          <div className="flex items-center gap-4">
            <DeletePostButton postId={post.id} clientId={id} />
            <Link
              href={`/clients/${id}/posts/${postId}/edit`}
              className="text-xs text-gray-400 hover:text-[#D48B00] transition-colors"
            >
              Edit →
            </Link>
          </div>
        </div>
        <div className="space-y-2.5">
          <MetaRow label="SEO Title" value={post.seo_title} />
          <MetaRow label="H1 Title" value={post.h1_title} />
          <MetaRow label="Meta Description" value={post.meta_description} />
          <MetaRow label="URL Slug" value={post.slug} />
          <MetaRow label="Primary Keyword" value={post.primary_keyword} />
          <MetaRow label="Secondary Keywords" value={post.secondary_keywords} />
          <MetaRow label="Target Audience" value={post.target_audience} />
          <MetaRow label="Post Goal" value={post.post_goal} />
        </div>
      </section>

      {/* 1 · Prompt Runner — not collapsible */}
      <StepDivider step={1} label="Prompt Runner" />
      <section>
        <PromptRunner post={post} clientId={id} />
      </section>

      {/* 2 · The Outline — collapsible */}
      <CollapsibleSection step={2} label="The Outline">
        {post.outline_output ? (
          <OutlineEditor
            postId={post.id}
            clientId={id}
            outline={post.outline_output}
            hasClientDriveFolder={!!client.google_drive_folder_id}
            existingDocUrl={post.google_doc_url ?? null}
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-2 text-center">
            <p className="text-sm text-gray-400">No outline saved yet. Run Prompt 02 above to generate one.</p>
          </div>
        )}
      </CollapsibleSection>

      {/* 3 · Client Brief — collapsible */}
      <CollapsibleSection step={3} label="Client Brief">
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-2">
          <ClientBriefInput
            postId={post.id}
            clientId={id}
            currentAnswers={post.client_brief_answers}
          />
        </section>
      </CollapsibleSection>

      {/* 4 · Drafts — collapsible */}
      <CollapsibleSection step={4} label="Drafts">
        {post.draft_output ? (
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Saved Draft</h2>
              <CopyButton text={post.draft_output} />
            </div>
            <div className="p-5">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {post.draft_output}
              </pre>
            </div>
          </section>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5 text-center">
            <p className="text-sm text-gray-400">No draft saved yet. Run Prompt 03 once client brief answers are in.</p>
          </div>
        )}
      </CollapsibleSection>
    </div>
  )
}
