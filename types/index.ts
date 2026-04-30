export type PostStatus =
  | 'not_started'
  | 'outline_done'
  | 'brief_sent'
  | 'client_input_received'
  | 'draft_done'
  | 'shft_review'
  | 'client_review'
  | 'approved'
  | 'published'

export type PostType = 'hub' | 'spoke'

export type PromptType = '02' | '03' | '04'

export interface Client {
  id: string
  name: string
  slug: string
  tov_guide: string | null
  brand_strategy: string | null
  google_drive_folder_id: string | null
  google_drive_folder_url: string | null
  created_at: string
}

export interface Post {
  id: string
  client_id: string
  hub_number: number
  spoke_number: number | null
  type: PostType
  seo_title: string | null
  h1_title: string | null
  subtitle: string | null
  meta_description: string | null
  slug: string | null
  primary_keyword: string | null
  secondary_keywords: string | null
  target_audience: string | null
  post_goal: string | null
  status: PostStatus
  client_brief_answers: string | null
  outline_output: string | null
  draft_output: string | null
  google_doc_url: string | null
  google_drive_subfolder_id: string | null
  created_at: string
  updated_at: string
  clients?: Client
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  not_started: 'Not Started',
  outline_done: 'Outline Done',
  brief_sent: 'Brief Sent',
  client_input_received: 'Input Received',
  draft_done: 'Draft Done',
  shft_review: 'SHFT Review',
  client_review: 'Client Review',
  approved: 'Approved',
  published: 'Published',
}

export const STATUS_COLORS: Record<PostStatus, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  outline_done: 'bg-blue-100 text-blue-700',
  brief_sent: 'bg-amber-100 text-amber-700',
  client_input_received: 'bg-orange-100 text-orange-700',
  draft_done: 'bg-violet-100 text-violet-700',
  shft_review: 'bg-indigo-100 text-indigo-700',
  client_review: 'bg-rose-100 text-rose-700',
  approved: 'bg-teal-100 text-teal-700',
  published: 'bg-green-100 text-green-700',
}

export const STATUS_ORDER: PostStatus[] = [
  'not_started',
  'outline_done',
  'brief_sent',
  'client_input_received',
  'draft_done',
  'shft_review',
  'client_review',
  'approved',
  'published',
]

