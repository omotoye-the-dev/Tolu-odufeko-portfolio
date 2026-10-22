-- =====================================================================
-- Add Donate Drive Impact Metrics to Site Settings
-- =====================================================================

alter table site_settings
  add column if not exists donate_stat1_value text default '2,500+',
  add column if not exists donate_stat1_label text default 'Children empowered',
  add column if not exists donate_stat2_value text default '10+',
  add column if not exists donate_stat2_label text default 'States reached',
  add column if not exists donate_stat3_value text default '5 yrs',
  add column if not exists donate_stat3_label text default 'Of impact';
