-- Add draft Google Doc URL to posts
alter table posts
  add column if not exists draft_doc_url text;
