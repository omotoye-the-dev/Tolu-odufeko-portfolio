-- =====================================================================
-- Migration 009: Add Hero Image and About Page Images to Site Settings
-- Run this in your Supabase SQL Editor
-- =====================================================================

alter table site_settings
  add column if not exists hero_image text default '/images/tolu-odufeko.png',
  add column if not exists about_image text default '/images/tolu-odufeko.png',
  add column if not exists about_ngo_images text[] default array[
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&auto=format'
  ];

-- Ensure any existing default row has the fallback values populated
update site_settings
set
  hero_image = coalesce(hero_image, '/images/tolu-odufeko.png'),
  about_image = coalesce(about_image, '/images/tolu-odufeko.png'),
  about_ngo_images = coalesce(
    about_ngo_images,
    array[
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&h=800&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&auto=format'
    ]
  )
where id = 'default';
