-- =====================================================================
-- COMPLETE DATABASE SETUP SCRIPT (FOR FRESH SUPABASE PROJECT)
-- Run this entire script in your new Supabase Project's SQL Editor.
-- It creates all tables, triggers, indexes, RLS policies, storage bucket,
-- and seeds the initial content and settings.
-- =====================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. UPDATED_AT TRIGGER FUNCTION
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────────────
-- 3. TABLES
-- ─────────────────────────────────────────────────────────────────────

-- Projects Table
create table if not exists public.projects (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  categories   text[] not null default '{}',
  excerpt      text not null,
  image        text not null,
  images       text[] not null default '{}',
  date         date not null,
  tech_stack   text[] not null default '{}',
  featured     boolean not null default false,
  link         text,
  body         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Articles Table
create table if not exists public.articles (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null,
  image        text not null,
  images       text[] not null default '{}',
  date         date not null,
  read_time    text not null,
  tags         text[] not null default '{}',
  featured     boolean not null default false,
  link         text,
  body         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Now Items Table
create table if not exists public.now_items (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text not null,
  date         text not null,
  status       text not null,
  image        text,
  images       text[] not null default '{}',
  link         text,
  link_text    text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Gallery Items Table
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  caption      text,
  image_url    text not null,
  images       text[] not null default '{}',
  category     text not null default 'General',
  event_date   date,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Site Settings Table (Singleton Row 'default')
create table if not exists public.site_settings (
  id                       text primary key default 'default',
  cv_url                   text,
  github_url               text not null default 'https://github.com/fekoh17',
  linkedin_url             text not null default 'https://www.linkedin.com/in/toluwanimi-odufeko-5156011b5/',
  instagram_url            text default 'https://www.instagram.com/ziba.feko/',
  twitter_url              text default 'https://www.instagram.com/ziba.feko/',
  
  -- Home / Hero Section
  hero_eyebrow             text default 'Engineer · Builder · Voice for impact',
  hero_title               text default 'Toluwanimi Odufeko',
  hero_subtext             text default 'Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves.',
  hero_image               text default '/images/tolu-odufeko.png',
  
  -- Bio Section
  bio_eyebrow              text default 'About Me',
  bio_title                text default 'Building Systems, Solving Problems & Empowering Lives',
  bio_paragraphs           text[] default array[
    'I am an engineer in the oil and gas sector with a B.Eng. in Electrical and Electronics Engineering, driven by a passion for building systems, solving problems, and making complex ideas easier to understand.',
    'My interests sit at the intersection of engineering, reliable energy, technology, and people development. I founded Donate Drive to help children from underserved communities discover purpose and access opportunities that shape their future.',
    'At the core of everything I do is a simple desire: to build, to teach, to create, and to help people become better.'
  ],
  
  -- Projects Section on Home
  projects_eyebrow         text default 'selected work',
  projects_title           text default 'Featured Projects',
  projects_subtext         text default 'Hardware and software built for the field — filter by discipline.',
  
  -- Articles Section on Home
  articles_eyebrow         text default 'writing',
  articles_title           text default 'Latest Articles',
  articles_subtext         text default 'Notes on engineering, building an NGO, and staying useful.',
  
  -- Services Section on Home
  services_eyebrow         text default 'work with me',
  services_title           text default 'How Can I Help You?',
  services_subtext         text default 'Ways we can collaborate, build, or create meaningful impact together.',
  
  -- About Page
  about_eyebrow            text default 'Biography',
  about_title              text default 'About Me',
  about_subtext            text default 'Engineer, builder, and voice for impact — working at the intersection of engineering, reliable energy, technology, and people development.',
  about_image              text default '/images/tolu-odufeko.png',
  about_ngo_images         text[] default array[
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&auto=format'
  ],
  about_donate_eyebrow     text default 'Donate Drive',
  about_donate_title       text default 'What I''m Building',
  about_donate_subtext     text default 'Donate Drive is committed to helping children from underserved communities discover purpose and gain access to opportunities that can shape their future. Over the past five years, we have empowered children through education, mentorship, scholarships, skills development, and community outreach.',
  
  -- Donate Drive Impact Metrics
  donate_stat1_value       text not null default '2,500+',
  donate_stat1_label       text not null default 'Children empowered',
  donate_stat2_value       text not null default '10+',
  donate_stat2_label       text not null default 'States reached',
  donate_stat3_value       text not null default '5 yrs',
  donate_stat3_label       text not null default 'Of impact',
  
  -- Skills on About Page
  about_skills_eyebrow     text default 'Capabilities',
  about_skills_title       text default 'Skills & Expertise',
  
  -- Projects Dedicated Page
  projects_page_eyebrow    text default 'Portfolio',
  projects_page_title      text default 'Projects',
  projects_page_subtext    text default 'Hardware and software built for the field — filter by discipline.',
  
  -- Articles Dedicated Page
  articles_page_eyebrow    text default 'Writing & Notes',
  articles_page_title      text default 'Articles',
  articles_page_subtext    text default 'Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays.',
  
  -- Now Page
  now_eyebrow              text default 'Focus & Priorities',
  now_title                text default 'What I''m Doing Now',
  now_subtext              text default 'A running snapshot of where my attention actually is.',
  
  -- Contact Page
  contact_eyebrow          text default 'Reach Out',
  contact_title            text default 'Get In Touch',
  contact_subtext          text default 'Whether it’s a hardware problem worth solving, a collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you.',
  
  -- Gallery Page
  gallery_eyebrow          text default 'Visual Moments',
  gallery_title            text default 'Gallery',
  gallery_subtext          text default 'A visual journey through engineering field work, speaking engagements, community initiatives, and milestone moments.',
  
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. TRIGGERS (AUTO-UPDATE `updated_at`)
-- ─────────────────────────────────────────────────────────────────────

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.set_updated_at();

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles
  for each row execute procedure public.set_updated_at();

drop trigger if exists now_items_updated_at on public.now_items;
create trigger now_items_updated_at before update on public.now_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists gallery_items_updated_at on public.gallery_items;
create trigger gallery_items_updated_at before update on public.gallery_items
  for each row execute procedure public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 5. PERFORMANCE INDEXES
-- ─────────────────────────────────────────────────────────────────────

create index if not exists idx_projects_date on public.projects(date desc);
create index if not exists idx_projects_featured on public.projects(featured) where featured = true;
create index if not exists idx_projects_slug on public.projects(slug);

create index if not exists idx_articles_date on public.articles(date desc);
create index if not exists idx_articles_featured on public.articles(featured) where featured = true;
create index if not exists idx_articles_slug on public.articles(slug);

create index if not exists idx_now_items_sort_order on public.now_items(sort_order asc, created_at desc);

create index if not exists idx_gallery_items_sort_order on public.gallery_items(sort_order asc, created_at desc);
create index if not exists idx_gallery_items_category on public.gallery_items(category);

-- ─────────────────────────────────────────────────────────────────────
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────────────

alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.now_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_settings enable row level security;

-- Public read access
drop policy if exists "Public read projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);

drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles" on public.articles for select using (true);

drop policy if exists "Public read now_items" on public.now_items;
create policy "Public read now_items" on public.now_items for select using (true);

drop policy if exists "Public read gallery_items" on public.gallery_items;
create policy "Public read gallery_items" on public.gallery_items for select using (true);

drop policy if exists "Public read site_settings" on public.site_settings;
create policy "Public read site_settings" on public.site_settings for select using (true);

-- Authenticated Admin full access (insert/update/delete)
drop policy if exists "Admin write projects" on public.projects;
create policy "Admin write projects" on public.projects for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write articles" on public.articles;
create policy "Admin write articles" on public.articles for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write now_items" on public.now_items;
create policy "Admin write now_items" on public.now_items for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write gallery_items" on public.gallery_items;
create policy "Admin write gallery_items" on public.gallery_items for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write site_settings" on public.site_settings;
create policy "Admin write site_settings" on public.site_settings for all using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────
-- 7. SUPABASE STORAGE BUCKET (`portfolio-media`)
-- ─────────────────────────────────────────────────────────────────────

-- Create public storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760, -- 10MB limit per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

-- Public read access to portfolio-media storage objects
drop policy if exists "Public access to portfolio media" on storage.objects;
create policy "Public access to portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

-- Authenticated upload access to portfolio-media
drop policy if exists "Authenticated insert into portfolio media" on storage.objects;
create policy "Authenticated insert into portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- Authenticated update access to portfolio-media
drop policy if exists "Authenticated update into portfolio media" on storage.objects;
create policy "Authenticated update into portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- Authenticated delete access to portfolio-media
drop policy if exists "Authenticated delete from portfolio media" on storage.objects;
create policy "Authenticated delete from portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────
-- 8. INITIAL SEED DATA
-- ─────────────────────────────────────────────────────────────────────

-- Ensure default singleton row exists for site_settings
insert into public.site_settings (id)
values ('default')
on conflict (id) do nothing;

-- Sample starter projects
insert into public.projects (slug, title, categories, excerpt, image, date, tech_stack, featured, link, body) values
(
  'grid-microgrid-controller',
  'Solar Microgrid Controller for Rural Clinics',
  array['Engineering','NGO'],
  'A ruggedized controller that balances solar, battery, and generator input to keep vaccine refrigeration online across unreliable grids.',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop&auto=format',
  '2026-05-18',
  array['Embedded C','STM32','MPPT','LoRaWAN','Solar PV'],
  true,
  'https://github.com',
  array[
    'Rural clinics across three northern states were losing entire cold-chain batches during unpredictable outages. The brief was blunt: keep the fridge running, no matter what the grid does.',
    'The controller arbitrates between solar array, a 5kWh LiFePO4 bank, and a fuel generator, prioritising the cheapest available source while guaranteeing critical loads never drop below threshold. A LoRaWAN uplink reports state-of-charge back to a central dashboard so a technician 200km away knows before a clinic does.',
    'Twelve units have run continuously for eight months with zero cold-chain losses — down from an average of two spoiled batches per site per quarter.'
  ]
),
(
  'donate-drive-platform',
  'Donate Drive Distribution Platform',
  array['Software','NGO'],
  'The logistics and transparency layer behind Donate Drive — tracking supplies from donor to child across ten states.',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=450&fit=crop&auto=format',
  '2026-03-02',
  array['TypeScript','PostgreSQL','React','Mapbox'],
  true,
  'https://github.com',
  array[
    'Donors want to know their contribution reached a child, not a warehouse. Donate Drive needed an auditable trail from intake to delivery.',
    'Every crate carries a QR code scanned at each handoff; the platform reconciles those scans against distribution manifests and surfaces discrepancies for review. A public map shows aggregate impact without exposing beneficiary data.',
    'The system now coordinates distribution to more than 4,200 children across ten states, in partnership with Sterling Bank.'
  ]
),
(
  'motor-fault-detection',
  'Predictive Fault Detection for Industrial Motors',
  array['Engineering','Software'],
  'Vibration and current-signature analysis that flags bearing failures weeks before they take a production line down.',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop&auto=format',
  '2025-11-14',
  array['Python','Signal Processing','scikit-learn','MQTT'],
  true,
  'https://github.com',
  array[
    'Unplanned motor failures were costing a mid-size plant roughly a shift of downtime each month. Current-signature analysis offered a non-invasive way to see trouble coming.',
    'A clamp-on sensor streams three-phase current at 10kHz; the pipeline extracts spectral features and scores them against a model trained on labelled failure histories. Alerts land in the maintenance team''s existing tooling.',
    'Across the pilot, the model caught four of five bearing degradations with lead times between nine and thirty-one days.'
  ]
)
on conflict (slug) do nothing;

-- Sample starter articles
insert into public.articles (slug, title, excerpt, image, date, read_time, tags, featured, body) values
(
  'designing-for-repair',
  'Designing for Repair, Not Just Reliability',
  'Reliability keeps a device alive until it dies. Repairability keeps it alive after. In the field, the second one matters more.',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop&auto=format',
  '2026-06-30',
  '7 min read',
  array['Engineering','Design'],
  true,
  array[
    'We obsess over MTBF numbers, but in a rural deployment the more honest question is: when this fails — and it will — who fixes it, with what, and how fast?',
    'A device that lasts three years and then becomes e-waste is worse than one that lasts one year but can be repaired indefinitely by the person who owns it.',
    'Design for repair means through-hole where you can, standard fasteners, printed schematics, and parts someone can actually source within a day''s travel. It is unglamorous and it is the whole game.'
  ]
),
(
  'building-donate-drive',
  'What Building an NGO Taught Me About Systems',
  'Running Donate Drive turned out to be an engineering problem wearing a humanitarian coat.',
  'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&h=450&fit=crop&auto=format',
  '2026-05-11',
  '9 min read',
  array['NGO','Leadership'],
  true,
  array[
    'I started Donate Drive thinking the hard part was raising money. The hard part was trust — proving that a donation actually reached a child.',
    'Every process failure I hit had an analogue in a control system: unobservable states, feedback delays, integrators that wind up. Once I stopped treating logistics as goodwill and started treating it as a system to be instrumented, everything got clearer.',
    'The lesson generalises: if you can''t measure it, you can''t improve it, and people fill unmeasured gaps with assumptions that are usually wrong.'
  ]
)
on conflict (slug) do nothing;

-- Sample starter now item
insert into public.now_items (title, description, date, status, sort_order)
values (
  'Engineering & Energy Infrastructure',
  'Commissioning power monitoring setups and building community initiatives through Donate Drive.',
  'Since June 2026',
  'Active',
  0
)
on conflict do nothing;
