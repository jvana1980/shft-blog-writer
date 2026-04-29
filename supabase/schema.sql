-- SHFT Blog Writer — Database Schema
-- Run this in your Supabase project: SQL Editor → New Query → paste → Run

create table clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  tov_guide text,
  brand_strategy text,
  created_at timestamp with time zone default now()
);

create table posts (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id) on delete cascade not null,
  hub_number integer not null check (hub_number between 1 and 5),
  type text not null check (type in ('hub', 'spoke')),
  seo_title text,
  h1_title text,
  subtitle text,
  meta_description text,
  slug text,
  primary_keyword text,
  secondary_keywords text,
  target_audience text,
  post_goal text,
  status text not null default 'not_started' check (status in (
    'not_started',
    'outline_done',
    'brief_sent',
    'client_input_received',
    'draft_done',
    'shft_review',
    'client_review',
    'approved',
    'published'
  )),
  client_brief_answers text,
  outline_output text,
  draft_output text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table prompt_runs (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  prompt_type text not null check (prompt_type in ('02', '03', '04')),
  assembled_prompt text,
  output text,
  created_at timestamp with time zone default now()
);

-- Index for common queries
create index posts_client_id_idx on posts(client_id);
create index posts_status_idx on posts(status);
create index prompt_runs_post_id_idx on prompt_runs(post_id);
