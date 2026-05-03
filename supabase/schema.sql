-- Minimal CMS schema for company profile + services
-- Run this in Supabase Dashboard -> SQL Editor.

-- Extensions
create extension if not exists pgcrypto;

-- Helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables
create table if not exists public.site_settings (
  id int primary key default 1,
  company_name text not null default 'Company',
  contact_email text not null default 'hello@example.com',
  contact_phone text not null default '+1 555 000 0000',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Admin check based on the authenticated user's email (JWT claim)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where lower(au.email) = lower((auth.jwt() ->> 'email'))
      and au.is_active = true
  );
$$;

-- Row Level Security (RLS)
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies
drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_services" on public.services;
create policy "public_read_services"
on public.services
for select
to anon, authenticated
using (true);

-- Admin-only write policies
drop policy if exists "admin_write_site_settings" on public.site_settings;
create policy "admin_write_site_settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_write_services" on public.services;
create policy "admin_write_services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admin users table: allow an authenticated user to read only their own record
drop policy if exists "self_read_admin_users" on public.admin_users;
create policy "self_read_admin_users"
on public.admin_users
for select
to authenticated
using (lower(email) = lower((auth.jwt() ->> 'email')));

-- Admin users: only admins can manage admins (bootstrap via SQL editor as project owner)
drop policy if exists "admin_manage_admin_users" on public.admin_users;
create policy "admin_manage_admin_users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Seed the singleton row (safe to run multiple times)
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- Seed your first admin (replace email, then run once)
-- insert into public.admin_users (email, role, is_active)
-- values ('you@example.com', 'admin', true)
-- on conflict (email) do update set is_active = true;

