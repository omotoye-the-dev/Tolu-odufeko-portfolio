-- =====================================================================
-- Gallery Items Table & Site Settings Gallery Header Fields
-- =====================================================================

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text not null,
  category text not null default 'General',
  event_date date,
  sort_order int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security
alter table gallery_items enable row level security;

create policy "Allow public read on gallery_items"
  on gallery_items for select
  using (true);

create policy "Allow authenticated admin full access on gallery_items"
  on gallery_items for all
  using (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_gallery_items_sort_order on gallery_items (sort_order asc, created_at desc);
create index if not exists idx_gallery_items_category on gallery_items (category);

-- Add gallery header fields to site_settings
alter table site_settings
  add column if not exists gallery_eyebrow text default 'Visual Moments',
  add column if not exists gallery_title text default 'Gallery',
  add column if not exists gallery_subtext text default 'A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.';
