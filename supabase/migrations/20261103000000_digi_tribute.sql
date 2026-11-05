-- Digi Tribute backend (draft, NOT applied). Review before running.
-- Design: all access goes through server functions in /api/tribute using the service role key.
-- Row level security is ON and there are no anon/authenticated policies, so direct browser access is denied.
-- Only a minimal, tribute-safe subset of the Golden Record is stored here. Never store SSN, parents' names,
-- addresses or financial data in these tables.

create extension if not exists pgcrypto;

create table if not exists public.tribute_cases (
  case_id text primary key,                       -- GoldenRecordCase.id from the back office
  display_name text not null,                     -- DecedentInfo.legalName (as it should be shown)
  date_of_birth date,
  date_of_death date,
  chapel_name text,
  service_summary jsonb not null default '{}'::jsonb,   -- date, time, location text only
  obituary_excerpt text,
  public_slug text unique,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  theme text not null default 'classic',
  seconds_per_photo int not null default 5 check (seconds_per_photo between 3 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tribute_invites (
  id uuid primary key default gen_random_uuid(),
  case_id text not null references public.tribute_cases(case_id) on delete cascade,
  recipient_name text not null,
  recipient_contact text,
  channel text not null check (channel in ('sms','email','whatsapp')),
  token_hash text not null unique,                -- sha256 of the magic token; the token itself is never stored
  status text not null default 'sent' check (status in ('sent','opened','recorded')),
  personal_note text,
  expires_at timestamptz not null,
  max_uploads int not null default 20,
  uploads_used int not null default 0,
  revoked_at timestamptz,
  created_by text,
  created_at timestamptz not null default now(),
  opened_at timestamptz
);

create table if not exists public.tribute_items (
  id uuid primary key default gen_random_uuid(),
  case_id text not null references public.tribute_cases(case_id) on delete cascade,
  invite_id uuid references public.tribute_invites(id) on delete set null,
  contributor_name text not null,
  contributor_relation text,
  relationship_category text,
  pillar text check (pillar in ('joy','pain','help','action')),
  prompt_question text,
  media_type text not null check (media_type in ('voice','video','written','photo')),
  storage_path text,                              -- path inside the private tribute-media bucket
  caption text,
  raw_transcript text,                            -- written text or transcript
  status text not null default 'pending' check (status in ('pending','approved','featured','archived')),
  include_in_book boolean not null default true,
  include_in_slideshow boolean not null default true,
  is_featured boolean not null default false,
  consent_given boolean not null default false,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);

create table if not exists public.tribute_audit (
  id bigserial primary key,
  at timestamptz not null default now(),
  actor text not null,
  action text not null,
  case_id text,
  item_id uuid,
  detail jsonb not null default '{}'::jsonb
);

create index if not exists tribute_items_case_status on public.tribute_items (case_id, status);
create index if not exists tribute_invites_case on public.tribute_invites (case_id);

alter table public.tribute_cases   enable row level security;
alter table public.tribute_invites enable row level security;
alter table public.tribute_items   enable row level security;
alter table public.tribute_audit   enable row level security;
-- Intentionally no policies: only the service role (server functions) can read or write.

-- Private bucket for photos, audio and video. 15 MB limit, restricted types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tribute-media','tribute-media', false, 15728640,
        array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4','audio/webm','video/mp4','video/webm'])
on conflict (id) do nothing;
