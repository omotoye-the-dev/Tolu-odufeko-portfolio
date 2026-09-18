-- =====================================================================
-- Add Dynamic Section Content & Bio Fields to Site Settings
-- =====================================================================

alter table site_settings
  add column if not exists hero_eyebrow text default 'Engineer · Builder · Voice for impact',
  add column if not exists hero_title text default 'Toluwanimi Odufeko',
  add column if not exists hero_subtext text default 'Bridging technical excellence with personal development and purposeful work. Engineering, energy, and helping people become better versions of themselves.',
  add column if not exists bio_eyebrow text default 'About Me',
  add column if not exists bio_title text default 'Building Systems, Solving Problems & Empowering Lives',
  add column if not exists bio_paragraphs text[] default array[
    'I am an engineer in the oil and gas sector with a B.Eng. in Electrical and Electronics Engineering, driven by a passion for building systems, solving problems, and making complex ideas easier to understand.',
    'My interests sit at the intersection of engineering, reliable energy, technology, and people development. I founded Donate Drive to help children from underserved communities discover purpose and access opportunities that shape their future.',
    'At the core of everything I do is a simple desire: to build, to teach, to create, and to help people become better.'
  ],
  add column if not exists projects_eyebrow text default 'selected work',
  add column if not exists projects_title text default 'Featured Projects',
  add column if not exists projects_subtext text default 'Hardware and software built for the field — filter by discipline.',
  add column if not exists articles_eyebrow text default 'writing',
  add column if not exists articles_title text default 'Latest Articles',
  add column if not exists articles_subtext text default 'Notes on engineering, building an NGO, and staying useful.',
  add column if not exists services_eyebrow text default 'work with me',
  add column if not exists services_title text default 'How Can I Help You?',
  add column if not exists services_subtext text default 'Ways we can collaborate, build, or create meaningful impact together.';
