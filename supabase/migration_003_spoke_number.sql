-- Add spoke_number to posts
alter table posts
  add column if not exists spoke_number integer;
