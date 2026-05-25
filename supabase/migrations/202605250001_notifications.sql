create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  user_email text,
  title text not null,
  message text,
  target_path text,
  type text not null default 'info',
  read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notifications_user_created_at_idx
on public.notifications (user_id, created_at desc);

create index if not exists notifications_user_read_idx
on public.notifications (user_id, read);

alter table public.notifications enable row level security;

drop policy if exists "anon can read notifications" on public.notifications;
drop policy if exists "anon can insert notifications" on public.notifications;
drop policy if exists "anon can update notifications" on public.notifications;
drop policy if exists "anon can delete notifications" on public.notifications;

create policy "anon can read notifications"
on public.notifications for select
to anon
using (true);

create policy "anon can insert notifications"
on public.notifications for insert
to anon
with check (true);

create policy "anon can update notifications"
on public.notifications for update
to anon
using (true)
with check (true);

create policy "anon can delete notifications"
on public.notifications for delete
to anon
using (true);
