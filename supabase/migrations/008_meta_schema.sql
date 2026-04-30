-- 008_meta_schema.sql
-- Add Meta Ads integration columns.
-- Meta reports carry a "Powered by retainr" watermark until the channel
-- is formally included in a paid tier (controlled by META_WATERMARK_ENABLED
-- env var in generate-report).

-- ─────────── clients: Meta connection ───────────

alter table clients
  add column if not exists meta_ad_account_id text,
  add column if not exists meta_access_token  text;   -- AES-256-GCM encrypted long-lived token

comment on column clients.meta_ad_account_id is 'Meta ad account ID in act_XXXXXXXXXX format';
comment on column clients.meta_access_token  is 'AES-256-GCM encrypted Meta long-lived access token (~60-day expiry, auto-extended on each refresh)';

-- ─────────── reports: Meta data column ───────────

alter table reports
  add column if not exists raw_meta_data jsonb;

-- ─────────── alerts: add Meta-specific types ───────────

alter table alerts
  drop constraint if exists alerts_type_check;

alter table alerts
  add constraint alerts_type_check
  check (type in ('conversion_drop', 'roas_drop', 'budget_pace', 'meta_spend_spike', 'meta_roas_drop'));

-- ─────────── indexes ───────────

create index if not exists clients_meta_account_idx on clients (meta_ad_account_id)
  where meta_ad_account_id is not null;
