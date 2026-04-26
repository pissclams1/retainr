-- 006_phase2_schema.sql
-- Phase 2: shareable reports + new billing tiers (Growth / Pro / Scale)
-- See product brief: 14-day trial, $199/$499/$999, client caps 10/30/75.

-- ─────────── Reports: shareable structured output ───────────

alter table reports
  add column if not exists share_token text unique,
  add column if not exists narrative          text,
  add column if not exists key_takeaway       text,
  add column if not exists drivers            jsonb,
  add column if not exists explanations       jsonb,
  add column if not exists talking_points     jsonb;

-- Backfill share_token for existing reports
update reports set share_token = encode(gen_random_bytes(18), 'hex')
where share_token is null;

-- Index for fast public share-link lookups
create index if not exists reports_share_token_idx on reports (share_token);

-- Public read policy: anyone can read a report by share_token (no auth).
-- Application code MUST scope queries to a single share_token.
drop policy if exists "public report by share_token" on reports;
create policy "public report by share_token" on reports
  for select using (share_token is not null);

-- ─────────── Billing tiers: rename to Growth / Pro / Scale ───────────

-- Move any existing rows onto the new tier names so the new check
-- constraint passes when applied.
update agencies set subscription_tier = 'scale'
  where subscription_tier in ('agency');
update agencies set subscription_tier = 'growth'
  where subscription_tier in ('starter');

-- Replace the tier check constraint
alter table agencies
  drop constraint if exists agencies_subscription_tier_check;
alter table agencies
  add constraint agencies_subscription_tier_check
  check (subscription_tier in ('trial', 'growth', 'pro', 'scale'));

-- Plan-cap column. Source of truth for "you've connected too many clients."
alter table agencies
  add column if not exists client_account_limit integer not null default 10;

-- Default-set caps based on tier for any pre-existing rows.
update agencies set client_account_limit = case subscription_tier
  when 'trial'  then 10
  when 'growth' then 10
  when 'pro'    then 30
  when 'scale'  then 75
  else 10
end where client_account_limit is null or client_account_limit = 0;

-- ─────────── Subscriptions table (Stripe webhook target) ───────────
-- Tracks the lifecycle of Stripe subscriptions so we can audit and
-- reconcile against Stripe state. Agencies.subscription_status remains
-- the denormalized fast-path read.

create table if not exists subscriptions (
  id                       uuid primary key default uuid_generate_v4(),
  agency_id                uuid references agencies on delete cascade,
  stripe_subscription_id   text not null unique,
  stripe_customer_id       text not null,
  tier                     text not null check (tier in ('growth', 'pro', 'scale')),
  billing_period           text not null check (billing_period in ('monthly', 'yearly')),
  status                   text not null,    -- mirrors Stripe status string
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

alter table subscriptions enable row level security;

drop policy if exists "agency subscriptions" on subscriptions;
create policy "agency subscriptions" on subscriptions
  for all using (
    agency_id in (select id from agencies where owner_email = auth.jwt() ->> 'email')
  );

create index if not exists subscriptions_agency_idx on subscriptions (agency_id);
