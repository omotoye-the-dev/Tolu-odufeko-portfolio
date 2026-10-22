-- =====================================================================
-- Add Featured Flag to Articles Table
-- =====================================================================

alter table articles
  add column if not exists featured boolean not null default false;

create index if not exists idx_articles_featured
  on articles(featured) where featured = true;
