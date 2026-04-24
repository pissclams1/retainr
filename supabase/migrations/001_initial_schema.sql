-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- agencies
create table agencies (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  owner_email  text not null unique,
  brand_color  text default '#1A1A18',
  voice_notes  text,
  created_at   timestamptz default now()
);

-- clients
create table clients (
  id                 uuid primary key default uuid_generate_v4(),
  agency_id          uuid references agencies on delete cascade,
  name               text not null,
  industry           text,
  location           text,
  retainer_amount    integer,
  start_date         date,
  ga4_property_id    text,
  ga4_refresh_token  text,  -- AES-256 encrypted, never returned to client
  health_score       integer check (health_score between 0 and 100),
  last_refreshed     timestamptz,
  created_at         timestamptz default now()
);

-- commitments
create table commitments (
  id           uuid primary key default uuid_generate_v4(),
  client_id    uuid references clients on delete cascade,
  text         text not null,
  due_date     date,
  status       text not null default 'pending' check (status in ('pending', 'in_progress', 'done')),
  completed_at timestamptz,
  created_at   timestamptz default now()
);

-- reports
create table reports (
  id                    uuid primary key default uuid_generate_v4(),
  client_id             uuid references clients on delete cascade,
  period_month          text not null,          -- '2025-04'
  raw_ga4_data          jsonb,
  client_report_html    text,
  internal_briefing_json jsonb,
  generated_at          timestamptz default now(),
  unique (client_id, period_month)
);

-- alerts
create table alerts (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid references clients on delete cascade,
  type          text not null check (type in ('traffic_drop', 'cpl_spike', 'budget_pace')),
  threshold_pct integer not null,
  triggered_at  timestamptz default now(),
  seen          boolean not null default false
);

-- prompt_templates
create table prompt_templates (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,           -- 'client_report' | 'internal_briefing'
  version       text not null,           -- '1.0'
  system_prompt text not null,
  user_template text not null,
  is_active     boolean not null default true,
  notes         text,
  created_at    timestamptz default now(),
  unique (name, version)
);

-- Row-level security: agencies can only see their own data
alter table agencies    enable row level security;
alter table clients     enable row level security;
alter table commitments enable row level security;
alter table reports     enable row level security;
alter table alerts      enable row level security;

-- Policy: agency owner accesses their own agency
create policy "agency owner" on agencies
  for all using (owner_email = auth.jwt() ->> 'email');

-- Policy: clients belong to the authenticated user's agency
create policy "agency clients" on clients
  for all using (
    agency_id in (
      select id from agencies where owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "agency commitments" on commitments
  for all using (
    client_id in (
      select c.id from clients c
      join agencies a on c.agency_id = a.id
      where a.owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "agency reports" on reports
  for all using (
    client_id in (
      select c.id from clients c
      join agencies a on c.agency_id = a.id
      where a.owner_email = auth.jwt() ->> 'email'
    )
  );

create policy "agency alerts" on alerts
  for all using (
    client_id in (
      select c.id from clients c
      join agencies a on c.agency_id = a.id
      where a.owner_email = auth.jwt() ->> 'email'
    )
  );

-- Indexes
create index on clients (agency_id);
create index on commitments (client_id);
create index on reports (client_id, period_month);
create index on alerts (client_id, seen);
