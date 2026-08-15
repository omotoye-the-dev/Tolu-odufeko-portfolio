-- =====================================================================
-- Site Settings & Profile Schema (CV, Social Links, Contact Info)
-- Run this in your Supabase SQL Editor
-- =====================================================================

create table if not exists site_settings (
  id           text primary key default 'default',
  cv_url       text,
  github_url   text not null default 'https://github.com',
  linkedin_url text not null default 'https://linkedin.com',
  twitter_url  text default 'https://x.com',
  email        text not null default 'hello@example.com',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Updated-at trigger
create trigger site_settings_updated_at before update on site_settings
  for each row execute procedure set_updated_at();

-- Row-Level Security
alter table site_settings enable row level security;

-- Public read access
create policy "Public read site_settings" on site_settings
  for select using (true);

-- Authenticated admin write access
create policy "Admin write site_settings" on site_settings
  for all using (auth.role() = 'authenticated');

-- Initial singleton seed
insert into site_settings (id, cv_url, github_url, linkedin_url, twitter_url, email)
values (
  'default',
  null,
  'https://github.com',
  'https://linkedin.com',
  'https://x.com',
  'hello@example.com'
)
on conflict (id) do nothing;
