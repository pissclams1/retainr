-- 007_ga4_to_gads.sql
-- Rename GA4 columns to Google Ads equivalents on clients + reports tables.
-- Update alert types to reflect Google Ads metrics.

-- ─────────── clients: rename GA4 columns ───────────

alter table clients
  rename column ga4_property_id   to gads_customer_id;

alter table clients
  rename column ga4_refresh_token to gads_refresh_token;

comment on column clients.gads_customer_id   is 'Google Ads customer ID (10-digit numeric, no hyphens)';
comment on column clients.gads_refresh_token is 'AES-256-GCM encrypted OAuth refresh token — never returned to client';

-- ─────────── reports: rename raw data column ───────────

alter table reports
  rename column raw_ga4_data to raw_gads_data;

-- ─────────── alerts: replace GA4-era alert types ───────────

-- Drop existing type constraint before adding the new set
alter table alerts
  drop constraint if exists alerts_type_check;

alter table alerts
  add constraint alerts_type_check
  check (type in ('conversion_drop', 'roas_drop', 'budget_pace'));

-- Migrate any existing rows from old types to nearest equivalent
update alerts set type = 'conversion_drop' where type = 'traffic_drop';
update alerts set type = 'roas_drop'       where type = 'cpl_spike';
-- 'budget_pace' maps to itself — no update needed
