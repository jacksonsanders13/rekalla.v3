-- Rekalla initial schema
-- Tables, enums, indexes, and triggers. RLS policies live in the next migration.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.reminder_category as enum (
  'medication', 'meals', 'appointments', 'exercise', 'family_calls', 'custom'
);

create type public.recurrence_type as enum ('once', 'daily', 'weekly', 'monthly');

create type public.completion_status as enum ('completed', 'snoozed', 'skipped');

create type public.routine_period as enum ('morning', 'afternoon', 'evening');

create type public.vault_category as enum (
  'family', 'contact', 'doctor', 'medication', 'important_date', 'emergency', 'note'
);

create type public.care_status as enum ('pending', 'active', 'revoked');

create type public.notification_channel as enum ('push', 'email', 'sms');

create type public.notification_status as enum ('pending', 'sent', 'failed', 'cancelled');

-- ---------------------------------------------------------------------------
-- updated_at bookkeeping
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  phone text,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Care relationships (caregiver <-> patient)
-- ---------------------------------------------------------------------------
-- The patient creates an invitation addressed to an email. When someone with
-- that email accepts, caregiver_id is filled in and the status becomes active.

create table public.care_relationships (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  caregiver_id uuid references public.profiles (id) on delete cascade,
  invited_email text not null,
  relationship text, -- e.g. "Daughter", "Neighbor", "Home nurse"
  status public.care_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint care_no_self check (patient_id <> caregiver_id)
);

create unique index care_relationships_unique_pair
  on public.care_relationships (patient_id, lower(invited_email));
create index care_relationships_caregiver_idx on public.care_relationships (caregiver_id);
create index care_relationships_invited_email_idx on public.care_relationships (lower(invited_email));

create trigger care_relationships_updated_at
  before update on public.care_relationships
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Reminders
-- ---------------------------------------------------------------------------

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null,
  description text,
  category public.reminder_category not null default 'custom',
  time_of_day time not null,
  recurrence public.recurrence_type not null default 'once',
  -- Days for weekly recurrence: 0 = Sunday ... 6 = Saturday.
  days_of_week smallint[] not null default '{}',
  start_date date not null default current_date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminders_valid_range check (end_date is null or end_date >= start_date)
);

create index reminders_user_idx on public.reminders (user_id, is_active);
create index reminders_created_by_idx on public.reminders (created_by);

create trigger reminders_updated_at
  before update on public.reminders
  for each row execute function public.set_updated_at();

-- One row per reminder per day recording what happened (completed / snoozed / skipped).
create table public.reminder_events (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.reminders (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  due_date date not null,
  status public.completion_status not null,
  snoozed_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reminder_id, due_date)
);

create index reminder_events_user_date_idx on public.reminder_events (user_id, due_date);

create trigger reminder_events_updated_at
  before update on public.reminder_events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Daily routine
-- ---------------------------------------------------------------------------

create table public.routine_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  period public.routine_period not null,
  time_of_day time,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index routine_items_user_idx on public.routine_items (user_id, period, sort_order);

create trigger routine_items_updated_at
  before update on public.routine_items
  for each row execute function public.set_updated_at();

create table public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  routine_item_id uuid not null references public.routine_items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  completed_on date not null default current_date,
  created_at timestamptz not null default now(),
  unique (routine_item_id, completed_on)
);

create index routine_completions_user_date_idx
  on public.routine_completions (user_id, completed_on);

-- ---------------------------------------------------------------------------
-- Memory vault
-- ---------------------------------------------------------------------------

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category public.vault_category not null,
  title text not null,          -- person / medication / note name
  subtitle text,                -- relationship, specialty, dosage, etc.
  phone text,
  email text,
  address text,
  date_value date,              -- for birthdays and important dates
  notes text,
  photo_url text,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vault_items_user_category_idx on public.vault_items (user_id, category);
create index vault_items_search_idx on public.vault_items
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(subtitle, '') || ' ' || coalesce(notes, '')));

create trigger vault_items_updated_at
  before update on public.vault_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Wellness tracking (one entry per user per day)
-- ---------------------------------------------------------------------------

create table public.wellness_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_date date not null default current_date,
  mood smallint check (mood between 1 and 5),
  sleep_hours numeric(3, 1) check (sleep_hours >= 0 and sleep_hours <= 24),
  energy smallint check (energy between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create index wellness_entries_user_date_idx
  on public.wellness_entries (user_id, entry_date desc);

create trigger wellness_entries_updated_at
  before update on public.wellness_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Notifications (outbox pattern — a worker delivers rows with status 'pending')
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  channel public.notification_channel not null,
  title text not null,
  body text,
  scheduled_for timestamptz not null default now(),
  status public.notification_status not null default 'pending',
  sent_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index notifications_pending_idx
  on public.notifications (status, scheduled_for)
  where status = 'pending';
create index notifications_user_idx on public.notifications (user_id, created_at desc);
