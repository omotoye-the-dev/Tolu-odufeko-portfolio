-- =====================================================================
-- Migration 010: Remove Public Email from Site Settings
-- Run this in your Supabase SQL Editor
-- =====================================================================

alter table site_settings
  drop column if exists email;
