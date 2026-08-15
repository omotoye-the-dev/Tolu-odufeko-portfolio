-- =====================================================================
-- Portfolio CMS Schema
-- Run this in your Supabase SQL Editor
-- =====================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- Projects
-- ─────────────────────────────────────────────
create table if not exists projects (
  id           uuid primary key default uuid_generate_v4(),
  slug         text not null unique,
  title        text not null,
  categories   text[] not null default '{}',
  excerpt      text not null,
  image        text not null,
  date         date not null,
  tech_stack   text[] not null default '{}',
  featured     boolean not null default false,
  link         text,
  body         text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Articles
-- ─────────────────────────────────────────────
create table if not exists articles (
  id         uuid primary key default uuid_generate_v4(),
  slug       text not null unique,
  title      text not null,
  excerpt    text not null,
  image      text not null,
  date       date not null,
  read_time  text not null,
  tags       text[] not null default '{}',
  link       text,
  body       text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Now Items
-- ─────────────────────────────────────────────
create table if not exists now_items (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null,
  date        text not null,
  status      text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- Updated-at trigger
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute procedure set_updated_at();

create trigger articles_updated_at before update on articles
  for each row execute procedure set_updated_at();

create trigger now_items_updated_at before update on now_items
  for each row execute procedure set_updated_at();

-- ─────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────
alter table projects  enable row level security;
alter table articles  enable row level security;
alter table now_items enable row level security;

-- Public: anyone can SELECT
create policy "Public read projects"  on projects  for select using (true);
create policy "Public read articles"  on articles  for select using (true);
create policy "Public read now_items" on now_items for select using (true);

-- Admin: only authenticated users can mutate
create policy "Admin write projects"  on projects  for all using (auth.role() = 'authenticated');
create policy "Admin write articles"  on articles  for all using (auth.role() = 'authenticated');
create policy "Admin write now_items" on now_items for all using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Seed — initial data from lib/data.ts
-- ─────────────────────────────────────────────
insert into projects (slug, title, categories, excerpt, image, date, tech_stack, featured, link, body) values
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
),
(
  'off-grid-lighting-kit',
  'Modular Off-Grid Lighting Kit',
  array['Engineering','NGO'],
  'A repairable, locally-serviceable solar lighting kit designed to be assembled and maintained by community technicians.',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=450&fit=crop&auto=format',
  '2025-08-09',
  array['Circuit Design','PCB','DFM','Li-ion'],
  false,
  null,
  array[
    'Imported lighting kits die and stay dead — no parts, no schematics, no one trained to fix them. This kit was designed to be the opposite.',
    'Through-hole components, a single screwdriver for full disassembly, and a printed one-page repair guide mean a village technician can swap a failed driver in minutes. Every board is depanelised locally.',
    'Over 600 kits are in service; the median repair now happens in-community rather than being written off.'
  ]
),
(
  'water-pump-telemetry',
  'Borehole Pump Telemetry Network',
  array['Engineering','Software'],
  'Low-power telemetry that reports borehole pump health and water table depth over cellular in areas with no reliable internet.',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop&auto=format',
  '2025-04-21',
  array['ESP32','NB-IoT','Time-series DB','Grafana'],
  false,
  null,
  array[
    'A dry borehole discovered days late means a community walks for water. Cheap, low-power telemetry closes that gap.',
    'Battery-backed nodes wake hourly, sample pressure and flow, and push a compact packet over NB-IoT. Dashboards flag falling water tables and stalled pumps before failure.',
    'Eighteen boreholes are monitored today, with median fault-to-notification time under two hours.'
  ]
),
(
  'stem-workshop-curriculum',
  'Hands-On STEM Workshop Curriculum',
  array['NGO'],
  'A build-it-yourself electronics curriculum run in secondary schools — solder, measure, break things, understand why.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&auto=format',
  '2024-12-03',
  array['Education','Electronics','Mentorship'],
  false,
  null,
  array[
    'Textbook physics rarely survives contact with a real breadboard. This curriculum puts tools in students'' hands from day one.',
    'Eight sessions take students from Ohm''s law to a working solar-charged radio they keep. Kits are reusable; facilitators are trained local teachers.',
    'Run in fourteen schools so far, reaching more than 900 students.'
  ]
)
on conflict (slug) do nothing;

insert into articles (slug, title, excerpt, image, date, read_time, tags, body) values
(
  'designing-for-repair',
  'Designing for Repair, Not Just Reliability',
  'Reliability keeps a device alive until it dies. Repairability keeps it alive after. In the field, the second one matters more.',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop&auto=format',
  '2026-06-30',
  '7 min read',
  array['Engineering','Design'],
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
  array[
    'I started Donate Drive thinking the hard part was raising money. The hard part was trust — proving that a donation actually reached a child.',
    'Every process failure I hit had an analogue in a control system: unobservable states, feedback delays, integrators that wind up. Once I stopped treating logistics as goodwill and started treating it as a system to be instrumented, everything got clearer.',
    'The lesson generalises: if you can''t measure it, you can''t improve it, and people fill unmeasured gaps with assumptions that are usually wrong.'
  ]
),
(
  'current-signature-primer',
  'A Practical Primer on Current-Signature Analysis',
  'You can hear a failing motor in its current draw long before you hear it in the room. Here is how to listen.',
  'https://images.unsplash.com/photo-1580982327559-c1202864eb05?w=800&h=450&fit=crop&auto=format',
  '2026-02-19',
  '11 min read',
  array['Engineering','Signal Processing'],
  array[
    'A three-phase induction motor is a remarkably honest machine — mechanical faults leave fingerprints in the stator current spectrum.',
    'Bearing defects, broken rotor bars, and eccentricity each show up at predictable sideband frequencies around the supply. The trick is teasing them out of a signal dominated by the fundamental.',
    'I walk through a windowing and detrending approach that runs comfortably on a Raspberry Pi, with code you can adapt.'
  ]
),
(
  'build-learn-think-pray-repeat',
  'Build, Learn, Think, Pray, Repeat',
  'A note on the loop I try to live by, and why the order matters more than it looks.',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop&auto=format',
  '2025-10-28',
  '5 min read',
  array['Personal','Reflection'],
  array[
    'Build first, because a thing in the world teaches you more than a thing in your head. Then learn from what broke.',
    'Think about what the learning means before you act on it — reflection is where compounding happens. Pray, because I am not the author of most of what makes work succeed. Then repeat, a little wiser.',
    'It is not a productivity system. It is closer to a posture.'
  ]
)
on conflict (slug) do nothing;

insert into now_items (title, description, date, status, sort_order) values
('Scaling the microgrid controller to 40 clinics', 'Moving from a hand-assembled pilot to a small production run, with a partner shop handling assembly.', 'Since June 2026', 'In progress', 1),
('Writing a field guide to repairable electronics', 'Collecting everything I wish I''d known about designing hardware for places without a supply chain.', 'Since April 2026', 'Drafting', 2),
('Mentoring three engineering undergraduates', 'Weekly sessions on embedded systems and, mostly, on how to think about problems.', 'Ongoing', 'Active', 3),
('Reading', '"The Design of Everyday Things" (re-read) and "Poor Economics". Both keep changing how I build.', 'August 2026', 'Current', 4)
on conflict do nothing;
