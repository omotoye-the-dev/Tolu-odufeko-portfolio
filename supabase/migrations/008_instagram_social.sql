-- Migration 008: Add instagram_url to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT 'https://instagram.com';

-- Populate existing rows with twitter_url if available
UPDATE site_settings
SET instagram_url = COALESCE(twitter_url, 'https://instagram.com')
WHERE instagram_url IS NULL;
