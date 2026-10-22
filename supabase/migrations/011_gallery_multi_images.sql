-- =====================================================================
-- Add Multi-Image Album Support to Gallery Items
-- =====================================================================

alter table gallery_items
  add column if not exists images text[] not null default '{}';
