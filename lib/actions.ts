'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from './supabase'
import { PostStatus } from '@/types'

async function parseFileContent(file: File | null): Promise<string> {
  if (!file || file.size === 0) return ''
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf')
  if (isPdf) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text.trim()
  }
  return (await file.text()).trim()
}

// ── Clients ──────────────────────────────────────────────────────────────────

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const google_drive_folder_url = (formData.get('google_drive_folder_url') as string) || null

  const tovFile = formData.get('tov_guide_file') as File | null
  const brandFile = formData.get('brand_strategy_file') as File | null
  const tov_guide = await parseFileContent(tovFile)
  const brand_strategy = await parseFileContent(brandFile)

  let google_drive_folder_id: string | null = null
  if (google_drive_folder_url) {
    const { extractFolderIdFromUrl } = await import('./google')
    google_drive_folder_id = extractFolderIdFromUrl(google_drive_folder_url)
  }

  const { data, error } = await supabase
    .from('clients')
    .insert({ name, slug, tov_guide, brand_strategy, google_drive_folder_id, google_drive_folder_url })
    .select()
    .single()

  if (error) throw new Error(error.message)
  redirect(`/clients/${data.id}`)
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const tov_guide = formData.get('tov_guide') as string
  const brand_strategy = formData.get('brand_strategy') as string
  const google_drive_folder_url = (formData.get('google_drive_folder_url') as string) || null

  let google_drive_folder_id: string | null = null
  if (google_drive_folder_url) {
    const { extractFolderIdFromUrl } = await import('./google')
    google_drive_folder_id = extractFolderIdFromUrl(google_drive_folder_url)
  }

  const { error } = await supabase
    .from('clients')
    .update({ name, tov_guide, brand_strategy, google_drive_folder_id, google_drive_folder_url })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const client_id = formData.get('client_id') as string
  const hub_number = parseInt(formData.get('hub_number') as string)
  const type = formData.get('type') as 'hub' | 'spoke'
  const seo_title = formData.get('seo_title') as string
  const h1_title = formData.get('h1_title') as string
  const subtitle = formData.get('subtitle') as string
  const meta_description = formData.get('meta_description') as string
  const slug = formData.get('slug') as string
  const primary_keyword = formData.get('primary_keyword') as string
  const secondary_keywords = formData.get('secondary_keywords') as string
  const target_audience = formData.get('target_audience') as string
  const post_goal = formData.get('post_goal') as string

  let google_doc_url: string | null = null
  let google_drive_subfolder_id: string | null = null

  // Auto-create Drive subfolder + feedback doc if client has a Drive folder set
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('google_drive_folder_id')
      .eq('id', client_id)
      .single()

    if (client?.google_drive_folder_id) {
      const { createPostFolder, createFeedbackDoc } = await import('./google')
      const folderName = seo_title || `Hub ${hub_number} — ${type}`
      const subfolderId = await createPostFolder(client.google_drive_folder_id, folderName)
      google_drive_subfolder_id = subfolderId
      const doc = await createFeedbackDoc(subfolderId, `${folderName} — Client Feedback`)
      google_doc_url = doc.url
    }
  } catch {
    // Drive setup is best-effort — don't block post creation
  }

  const { error } = await supabase.from('posts').insert({
    client_id, hub_number, type, seo_title, h1_title, subtitle,
    meta_description, slug, primary_keyword, secondary_keywords,
    target_audience, post_goal, status: 'not_started',
    google_doc_url, google_drive_subfolder_id,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${client_id}`)
  redirect(`/clients/${client_id}`)
}

export async function updatePostStatus(postId: string, status: PostStatus, clientId: string) {
  const { error } = await supabase
    .from('posts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${clientId}`)
  revalidatePath(`/clients/${clientId}/posts/${postId}`)
}

export async function savePostOutput(
  postId: string,
  field: 'outline_output' | 'draft_output' | 'client_brief_answers',
  value: string,
  clientId: string,
) {
  const { error } = await supabase
    .from('posts')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${clientId}/posts/${postId}`)
}

export async function pushOutlineToDrive(postId: string, clientId: string) {
  const { data: post } = await supabase
    .from('posts')
    .select('*, clients(*)')
    .eq('id', postId)
    .single()

  if (!post) throw new Error('Post not found')
  if (!post.outline_output) throw new Error('No saved outline to push.')

  const client = post.clients as { google_drive_folder_id: string | null }
  if (!client?.google_drive_folder_id) {
    throw new Error('No Google Drive folder set for this client. Add one in the client settings.')
  }

  const { createPostFolder, createOutlineDoc } = await import('./google')

  // Build the folder + doc name from post data
  const label = post.type === 'hub'
    ? `Hub ${post.hub_number} - ${post.seo_title || 'Untitled'}`
    : `Hub ${post.hub_number} Spoke - ${post.seo_title || 'Untitled'}`

  // Create the subfolder if it doesn't exist yet, otherwise reuse it
  let subfolderId = post.google_drive_subfolder_id as string | null
  if (!subfolderId) {
    subfolderId = await createPostFolder(client.google_drive_folder_id, label)
    await supabase.from('posts').update({ google_drive_subfolder_id: subfolderId }).eq('id', postId)
  }

  // Always create a fresh outline doc (replaces the previous link)
  const doc = await createOutlineDoc(subfolderId, `${label} Outline`, post.outline_output)

  const { error } = await supabase
    .from('posts')
    .update({ google_doc_url: doc.url, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${clientId}/posts/${postId}`)
  return { url: doc.url }
}

export async function updatePostMeta(postId: string, formData: FormData, clientId: string) {
  const updates = {
    seo_title: formData.get('seo_title') as string,
    h1_title: formData.get('h1_title') as string,
    subtitle: formData.get('subtitle') as string,
    meta_description: formData.get('meta_description') as string,
    slug: formData.get('slug') as string,
    primary_keyword: formData.get('primary_keyword') as string,
    secondary_keywords: formData.get('secondary_keywords') as string,
    target_audience: formData.get('target_audience') as string,
    post_goal: formData.get('post_goal') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('posts').update(updates).eq('id', postId)
  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${clientId}/posts/${postId}`)
}
