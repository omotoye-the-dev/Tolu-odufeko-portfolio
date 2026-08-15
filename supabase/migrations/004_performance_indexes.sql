-- =====================================================================
-- Database Performance Indexes for Fast Queries & Sorting
-- Run this in your Supabase SQL Editor
-- =====================================================================

-- Projects indexes
create index if not exists idx_projects_date on projects(date desc);
create index if not exists idx_projects_featured on projects(featured) where featured = true;
create index if not exists idx_projects_slug on projects(slug);

-- Articles indexes
create index if not exists idx_articles_date on articles(date desc);
create index if not exists idx_articles_slug on articles(slug);

-- Now items indexes
create index if not exists idx_now_items_sort_order on now_items(sort_order asc);
