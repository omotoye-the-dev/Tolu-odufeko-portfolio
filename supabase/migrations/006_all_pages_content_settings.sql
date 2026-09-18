-- =====================================================================
-- Add Dynamic Section Content for All Pages to Site Settings
-- =====================================================================

alter table site_settings
  -- About Page
  add column if not exists about_eyebrow text default 'Biography',
  add column if not exists about_title text default 'About Me',
  add column if not exists about_subtext text default 'Engineer, builder, and voice for impact — working at the intersection of engineering, reliable energy, technology, and people development.',
  add column if not exists about_donate_eyebrow text default 'Donate Drive',
  add column if not exists about_donate_title text default 'What I''m Building',
  add column if not exists about_donate_subtext text default 'Donate Drive is committed to helping children from underserved communities discover purpose and gain access to opportunities that can shape their future. Over the past five years, we have empowered children through education, mentorship, scholarships, skills development, and community outreach.',
  add column if not exists about_skills_eyebrow text default 'Capabilities',
  add column if not exists about_skills_title text default 'Skills & Expertise',

  -- Projects Page (dedicated page headers)
  add column if not exists projects_page_eyebrow text default 'Portfolio',
  add column if not exists projects_page_title text default 'Projects',
  add column if not exists projects_page_subtext text default 'Hardware and software built for the field — filter by discipline.',

  -- Articles Page (dedicated page headers)
  add column if not exists articles_page_eyebrow text default 'Writing & Notes',
  add column if not exists articles_page_title text default 'Articles',
  add column if not exists articles_page_subtext text default 'Technical reflections, engineering analysis, solar microgrids, NGO leadership lessons, and essays.',

  -- Now Page
  add column if not exists now_eyebrow text default 'Focus & Priorities',
  add column if not exists now_title text default 'What I''m Doing Now',
  add column if not exists now_subtext text default 'A running snapshot of where my attention actually is.',

  -- Contact Page
  add column if not exists contact_eyebrow text default 'Reach Out',
  add column if not exists contact_title text default 'Get In Touch',
  add column if not exists contact_subtext text default 'Whether it’s a hardware problem worth solving, a collaboration, or supporting Donate Drive — I read every message. Tell me what you’re working on and I’ll get back to you.';
