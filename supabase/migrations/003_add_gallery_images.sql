-- =====================================================================
-- Add Gallery Images to Projects and Articles
-- Run this in your Supabase SQL Editor
-- =====================================================================

alter table projects add column if not exists images text[] not null default '{}';
alter table articles add column if not exists images text[] not null default '{}';
