-- Fix tier constraint: add 'pro' (was 'growth'), keep 'starter' and 'agency'
ALTER TABLE agencies DROP CONSTRAINT IF EXISTS agencies_subscription_tier_check;
ALTER TABLE agencies ADD CONSTRAINT agencies_subscription_tier_check
  CHECK (subscription_tier IN ('trial', 'starter', 'pro', 'agency'));

-- Usage tracking: report count + cycle start per billing period
ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS reports_this_cycle  INT         NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cycle_started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_agencies_cycle_started ON agencies (cycle_started_at);
