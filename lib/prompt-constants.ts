import { PromptType, PostStatus } from '@/types'

export const PROMPT_LABELS: Record<PromptType, string> = {
  '02': 'Generate Outline + Client Brief',
  '03': 'Write Draft',
  '04': 'Update Tone of Voice Guide',
}

export const PROMPT_DESCRIPTIONS: Record<PromptType, string> = {
  '02': 'Builds the full post outline with H2/H3 structure and generates the client brief to send for input.',
  '03': "Writes the full draft using the approved outline and the client's brief responses.",
  '04': 'Compares the final edited post to the current ToV guide and produces an updated, versioned guide.',
}

// Which prompt is available at each status
export const AVAILABLE_PROMPT: Partial<Record<PostStatus, PromptType>> = {
  not_started: '02',
  client_input_received: '03',
  approved: '04',
}
