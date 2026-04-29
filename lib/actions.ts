'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from './supabase'
import { PostStatus } from '@/types'

// ── Clients ──────────────────────────────────────────────────────────────────

export async function createClient(formData: FormData) {
  const name = formData.get('name') as string
  const tov_guide = formData.get('tov_guide') as string
  const brand_strategy = formData.get('brand_strategy') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('clients')
    .insert({ name, slug, tov_guide, brand_strategy })
    .select()
    .single()

  if (error) throw new Error(error.message)
  redirect(`/clients/${data.id}`)
}

export async function updateClient(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const tov_guide = formData.get('tov_guide') as string
  const brand_strategy = formData.get('brand_strategy') as string

  const { error } = await supabase
    .from('clients')
    .update({ name, tov_guide, brand_strategy })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath(`/clients/${id}`)
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

  const { error } = await supabase.from('posts').insert({
    client_id, hub_number, type, seo_title, h1_title, subtitle,
    meta_description, slug, primary_keyword, secondary_keywords,
    target_audience, post_goal, status: 'not_started',
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
