-- In-app account deletion.
-- The App Store requires that any app with sign-up lets people permanently
-- delete their account from inside the app. The client can't touch
-- auth.users directly, so this SECURITY DEFINER function does it on the
-- signed-in user's behalf — and only ever for the caller's own account.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'You must be signed in to delete your account.';
  end if;

  -- Uploaded files (avatars, vault photos) live under a folder named after
  -- the user's id; clear them so no orphaned storage lingers.
  delete from storage.objects
  where (storage.foldername(name))[1] = uid::text;

  -- Deleting the auth user cascades to the profile and, from there, to every
  -- table that hangs off it: reminders, reminder events, routine items and
  -- completions, vault items, wellness entries, and care relationships.
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
