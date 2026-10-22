-- =====================================================================
-- Add Images and Links Support to Now Items
-- =====================================================================

alter table now_items
  add column if not exists image text,
  add column if not exists images text[] not null default '{}',
  add column if not exists link text,
  add column if not exists link_text text;
