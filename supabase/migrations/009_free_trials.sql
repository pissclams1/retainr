-- Free trial usage tracking (email-based, server-enforced)
create table if not exists public.free_trials (
  id            uuid        default gen_random_uuid() primary key,
  email         text        unique not null,
  use_count     integer     default 1 not null,
  created_at    timestamptz default now(),
  last_used_at  timestamptz default now()
);

-- Only accessible via service role key in edge functions
alter table public.free_trials enable row level security;
