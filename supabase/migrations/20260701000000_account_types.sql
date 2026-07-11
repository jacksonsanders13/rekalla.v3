-- Account types (patient / caregiver), code-based linking, and view-only
-- enforcement so only caregivers manage a patient's reminders/routine/vault.

-- ---------------------------------------------------------------------------
-- Account type + connect code on profiles
-- ---------------------------------------------------------------------------

create type public.account_type as enum ('patient', 'caregiver');

alter table public.profiles
  add column account_type public.account_type not null default 'patient',
  add column connect_code text unique;

-- A short, human-friendly code a patient reads out to their caregiver.
-- Ambiguous characters (0/O, 1/I/L) are left out on purpose.
create or replace function public.generate_connect_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text;
  i int;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    exit when not exists (select 1 from public.profiles where connect_code = code);
  end loop;
  return code;
end;
$$;

-- Give every existing profile a code.
update public.profiles
  set connect_code = public.generate_connect_code()
  where connect_code is null;

-- New signups: read account_type from metadata and mint a connect code.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, account_type, connect_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(
      (new.raw_user_meta_data ->> 'account_type')::public.account_type,
      'patient'
    ),
    public.generate_connect_code()
  );
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Connect by code (a caregiver links to a patient)
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER so the caregiver can look up a patient by code without
-- read access to the whole profiles table. Only ever creates the link.

create or replace function public.connect_with_code(code text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  me public.profiles;
  patient public.profiles;
begin
  select * into me from public.profiles where id = auth.uid();
  if me.account_type is distinct from 'caregiver' then
    raise exception 'Only caregiver accounts can connect using a code.';
  end if;

  select * into patient
    from public.profiles
    where connect_code = upper(regexp_replace(coalesce(code, ''), '\s', '', 'g'));

  if patient.id is null then
    raise exception 'That code did not match anyone. Please check it and try again.';
  end if;
  if patient.id = auth.uid() then
    raise exception 'You can''t connect to your own account.';
  end if;
  if patient.account_type is distinct from 'patient' then
    raise exception 'That code belongs to a caregiver account, not a patient.';
  end if;

  insert into public.care_relationships (patient_id, caregiver_id, invited_email, status)
  values (patient.id, auth.uid(), coalesce(auth.email(), auth.uid()::text), 'active')
  on conflict (patient_id, lower(invited_email))
    do update set caregiver_id = auth.uid(), status = 'active';

  return patient;
end;
$$;

grant execute on function public.connect_with_code(text) to authenticated;

-- ---------------------------------------------------------------------------
-- View-only enforcement: only an active caregiver manages a patient's
-- reminders, routine, and vault. Patients keep read access, plus the ability
-- to complete reminders / check off routine / record wellness (unchanged).
-- ---------------------------------------------------------------------------

drop policy if exists "reminders: create own or as caregiver" on public.reminders;
drop policy if exists "reminders: update own or as caregiver" on public.reminders;
drop policy if exists "reminders: delete own or as caregiver" on public.reminders;

create policy "reminders: caregiver creates"
  on public.reminders for insert
  with check (public.is_caregiver_of(user_id) and created_by = auth.uid());
create policy "reminders: caregiver updates"
  on public.reminders for update
  using (public.is_caregiver_of(user_id))
  with check (public.is_caregiver_of(user_id));
create policy "reminders: caregiver deletes"
  on public.reminders for delete
  using (public.is_caregiver_of(user_id));

drop policy if exists "routine_items: write own" on public.routine_items;
drop policy if exists "routine_items: update own" on public.routine_items;
drop policy if exists "routine_items: delete own" on public.routine_items;

create policy "routine_items: caregiver creates"
  on public.routine_items for insert
  with check (public.is_caregiver_of(user_id));
create policy "routine_items: caregiver updates"
  on public.routine_items for update
  using (public.is_caregiver_of(user_id))
  with check (public.is_caregiver_of(user_id));
create policy "routine_items: caregiver deletes"
  on public.routine_items for delete
  using (public.is_caregiver_of(user_id));

drop policy if exists "vault_items: write own" on public.vault_items;
drop policy if exists "vault_items: update own" on public.vault_items;
drop policy if exists "vault_items: delete own" on public.vault_items;

create policy "vault_items: caregiver creates"
  on public.vault_items for insert
  with check (public.is_caregiver_of(user_id));
create policy "vault_items: caregiver updates"
  on public.vault_items for update
  using (public.is_caregiver_of(user_id))
  with check (public.is_caregiver_of(user_id));
create policy "vault_items: caregiver deletes"
  on public.vault_items for delete
  using (public.is_caregiver_of(user_id));
