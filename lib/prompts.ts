import 'server-only'
import fs from 'fs'
import path from 'path'
import { Post, Client, PromptType } from '@/types'
export { PROMPT_LABELS, PROMPT_DESCRIPTIONS } from './prompt-constants'

function getWritingSkill(): string {
  const filePath = path.join(process.cwd(), 'content', 'SHFT_SEO_WRITING_SKILL.md')
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return '[SHFT SEO Writing Skill doc not found — add to content/SHFT_SEO_WRITING_SKILL.md]'
  }
}

export function buildSystemPrompt(client: Client): string {
  const writingSkill = getWritingSkill()
  const tovGuide = client.tov_guide || '[No tone of voice guide uploaded for this client yet.]'
  const brandStrategy = client.brand_strategy || ''

  return `You are a senior SEO content strategist at SHFT Agency, writing content for ${client.name}.

Your job is to produce clean, publishable content that sounds like ${client.name} — not like a generic agency, and not like AI. Every piece goes through SHFT's editorial review before the client sees it, so it needs to be close to final.

---

## SHFT SEO Writing Standard

${writingSkill}

---

## ${client.name} — Tone of Voice Guide

${tovGuide}

${brandStrategy ? `---\n\n## ${client.name} — Brand Strategy\n\n${brandStrategy}` : ''}`
}

export function buildPrompt02(post: Post): string {
  return `Build the post outline and client brief for the following post.

POST DETAILS:
- Type: ${post.type === 'hub' ? 'Hub Page' : 'Spoke Post'}
- SEO Title: ${post.seo_title || '[not set]'}
- On-Page Title (H1): ${post.h1_title || '[not set]'}
- Primary Keyword: ${post.primary_keyword || '[not set]'}
- Secondary Keywords: ${post.secondary_keywords || '[not set]'}
- Target audience: ${post.target_audience || '[not set]'}
- Post goal: ${post.post_goal || '[not set]'}

---

Follow these steps exactly:

**Step 1: Keyword placement map.**
Show where each keyword will appear:
- Primary keyword: H1, intro, at least two H2s, conclusion
- Secondary keywords: note which section each will land in
Flag any secondary keyword that doesn't fit naturally.

**Step 2: Build the outline.**
Use this format:

[POST TITLE]
Subtitle: [one punchy line — the core promise of the post]

**Intro** (no heading — prose only)
Brief description of what the intro will do, following the SHFT 9-step intro structure.

---

[H2: First major section] (note keyword placement)
What this section covers in 1–2 sentences. What claim does it make?

> [H3: Subsection] (sentence case)
> What this subsection covers. If a client example fits naturally here, note it.

(Continue for all sections)

---

[H2: Closing section]
- If Hub: FAQs — list 5–7 questions targeting People Also Ask and long-tail variants
- If Spoke: Relevant Resources — note 3–5 internal links to include

CTA: Note what service page, contact form, or lead magnet the CTA should link to.

---

**Step 3: Write the Client Brief.**
A document the client fills in. For each section where their specific knowledge or stories would strengthen the post:

[Section Name]
*What we're planning to cover:* [1–2 sentences]
*For you:* [Specific question — ask for a client story, a framework, a specific result]

End with: "What we don't need from you: perfect writing, full sentences. Notes and bullet points are fine."

---

**Step 4: Flag any structural concerns** before finishing — thin sections, awkward keyword placement, missing information.`
}

export function buildPrompt03(post: Post): string {
  const outline = post.outline_output || '[No outline saved — paste the approved outline here or run Prompt 02 first.]'
  const briefAnswers = post.client_brief_answers || '[No client brief answers entered yet.]'

  return `Write the full draft for this post.

POST DETAILS:
- Type: ${post.type === 'hub' ? 'Hub Page' : 'Spoke Post'}
- SEO Title: ${post.seo_title || '[not set]'}
- On-Page Title (H1): ${post.h1_title || '[not set]'}
- Primary Keyword: ${post.primary_keyword || '[not set]'}
- Secondary Keywords: ${post.secondary_keywords || '[not set]'}

---

APPROVED OUTLINE:
${outline}

---

CLIENT BRIEF RESPONSES:
${briefAnswers}

---

Writing instructions:

1. Start with the metadata block. Fill in every field: Type, SEO Title, On-Page Title, Subtitle, Meta Description (under 160 characters), URL Slug, Primary Keyword, Secondary Keywords with volume/KD.

2. Write the post following the approved outline exactly.
   - Follow the SHFT 9-step intro structure for the opening
   - Keep paragraphs to 1–3 sentences
   - Front-load the point — claim first, support second
   - Use the right bullet style for the context (Style A for overviews, Style B for instructional, Style C for checklists)
   - Place client examples and stories where they're most useful as proof
   - Include IMAGE SUGGESTION callouts where a visual would genuinely help
   - Place secondary keywords in H3s and body copy naturally — never force them
   - Link internally: at minimum, one link to the hub page (if spoke), one link to a BOFU service or contact page

3. Apply the anti-AI checklist as you write, not after. Check every paragraph before moving on.

4. Write the closing section.
   - Hub: FAQs — minimum 5 questions. Answers: 2–4 sentences, direct, no fluff.
   - Spoke: Relevant Resources if applicable (3–5 links with one sentence each)
   - Every post: a specific CTA linking to the service page or contact form noted in the outline

5. After the draft, add a Writer's Note flagging:
   - Assumptions made due to limited client input
   - Statistics or claims that need verification before publishing
   - Sections where a client example was called for but none was available
   - Any keyword placement you weren't happy with

Voice check before submitting: Read the last paragraph you wrote. Does it sound like this specific client wrote it? If it could have been written by any agency, rewrite it before moving on.`
}

export function buildPrompt04(post: Post): string {
  const draft = post.draft_output || '[No final approved draft saved — paste the final post here.]'

  return `Update the tone of voice guide for this client based on what was learned from editing "${post.seo_title || 'this post'}".

The goal is to make future drafts closer to final — to capture whatever SHFT and the client changed, so the next post starts from a better place.

---

FINAL APPROVED POST:
${draft}

---

Follow these steps:

**Step 1:** Read the final approved post above carefully.

**Step 2:** Reference the current tone of voice guide (in your system context).

**Step 3: Compare and identify what changed.**

Look for patterns — not one-off word swaps, but recurring changes that signal a rule or preference. Ask:
- Word choices: Were words or phrases replaced consistently? What does the replacement reveal?
- Sentence structure: Were sentences consistently restructured? What pattern does that show?
- Paragraph structure: Were paragraphs broken up, merged, or reordered?
- Bullet style: Were bullets reformatted? Did bold leads get removed or added?
- Intro or closing: Were the opening or closing significantly rewritten?
- Vocabulary: Any new words or phrases that feel distinctly like this client?
- Proof and examples: Were client examples changed, expanded, or cut?
- Tone: Did the overall feel shift? What specific changes drove that?

**Step 4: Produce the updated tone of voice guide.**

Mark every change clearly:
- [NEW v{version}] for rules that are entirely new
- [UPDATED v{version}] for rules that were revised or made more specific
- [REMOVED v{version}] for rules that turned out to be wrong

Increment the version number by 1.

Add a Change Log at the top:

Change Log — Version [X.X]
Updated based on editing of: ${post.seo_title || 'this post'}
Updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Summary of changes / New rules added / Rules revised / Rules confirmed

**Step 5: Flag what you're not sure about.**

Note uncertain observations separately as "Patterns to Watch" — don't add them as rules until you've seen them twice.`
}

export function assemblePrompt(promptType: PromptType, post: Post, client: Client): {
  system: string
  user: string
} {
  const system = buildSystemPrompt(client)

  let user: string
  if (promptType === '02') user = buildPrompt02(post)
  else if (promptType === '03') user = buildPrompt03(post)
  else user = buildPrompt04(post)

  return { system, user }
}

