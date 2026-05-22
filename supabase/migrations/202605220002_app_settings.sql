create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.app_settings enable row level security;

drop policy if exists "anon can read app settings" on public.app_settings;
drop policy if exists "anon can insert app settings" on public.app_settings;
drop policy if exists "anon can update app settings" on public.app_settings;

create policy "anon can read app settings"
on public.app_settings for select
to anon
using (true);

create policy "anon can insert app settings"
on public.app_settings for insert
to anon
with check (true);

create policy "anon can update app settings"
on public.app_settings for update
to anon
using (true)
with check (true);

insert into public.app_settings (key, value, updated_by)
values (
  'api_docs_password',
  'scrypt:0bf7aaac-a9c2-4e01-85c0-8acc24b76b72:103cd10f7430eb355ed613f04e71412ee0d0e3239c53bb287bc9d9f8d64b72afc52bc7db162357ae66895d22afc776a7fbbbe8668c22b0fd4f9bdff63c11cd61',
  'migration'
)
on conflict (key) do nothing;
