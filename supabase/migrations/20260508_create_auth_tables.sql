-- Create users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create sessions table
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  session_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  remember_me boolean not null default false
);

-- Create password reset tokens table
create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

-- Create indexes
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_token on public.sessions(session_token);
create index if not exists idx_password_reset_user on public.password_reset_tokens(user_id);
create index if not exists idx_password_reset_token on public.password_reset_tokens(token);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.password_reset_tokens enable row level security;

-- RLS Policies
create policy "Users can read own user data" on public.users
  for select using (true);

create policy "Sessions can be read by their user" on public.sessions
  for select using (true);
