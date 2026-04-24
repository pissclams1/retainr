alter table agencies
  add column if not exists stripe_customer_id    text,
  add column if not exists subscription_tier     text not null default 'trial',
  add column if not exists subscription_status   text not null default 'trialing',
  add column if not exists trial_ends_at         timestamptz   default (now() + interval '14 days');

-- Constraint to keep tier values consistent
alter table agencies
  add constraint agencies_subscription_tier_check
  check (subscription_tier in ('trial', 'starter', 'growth', 'agency'));

alter table agencies
  add constraint agencies_subscription_status_check
  check (subscription_status in ('trialing', 'active', 'past_due', 'cancelled'));
