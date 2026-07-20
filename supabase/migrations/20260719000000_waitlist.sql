-- Early-access waitlist for the marketing site.
-- Anyone can add their email (insert-only); nobody can read the list back
-- through the API — there is no select policy, so the list is only visible to
-- the project owner in the Supabase dashboard.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "waitlist: anyone can join" on public.waitlist;
create policy "waitlist: anyone can join"
  on public.waitlist for insert
  to anon, authenticated
  with check (char_length(email) between 3 and 320);

grant insert on public.waitlist to anon, authenticated;
