-- Add Google Drive fields to clients
alter table clients
  add column if not exists google_drive_folder_id text,
  add column if not exists google_drive_folder_url text;

-- Add Google Drive fields to posts
alter table posts
  add column if not exists google_doc_url text,
  add column if not exists google_drive_subfolder_id text;
