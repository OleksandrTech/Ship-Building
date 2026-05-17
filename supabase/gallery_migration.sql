-- Gallery images (run in SQL Editor if schema.sql was already applied)

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_gallery_images_updated_at
before update on public.gallery_images
for each row execute function public.set_updated_at();

alter table public.gallery_images enable row level security;

drop policy if exists "public_read_gallery_images" on public.gallery_images;
create policy "public_read_gallery_images"
on public.gallery_images
for select
to anon, authenticated
using (true);

drop policy if exists "admin_write_gallery_images" on public.gallery_images;
create policy "admin_write_gallery_images"
on public.gallery_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Storage bucket (public read for website visitors)
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

drop policy if exists "public_read_gallery_storage" on storage.objects;
create policy "public_read_gallery_storage"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

drop policy if exists "admin_upload_gallery_storage" on storage.objects;
create policy "admin_upload_gallery_storage"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admin_update_gallery_storage" on storage.objects;
create policy "admin_update_gallery_storage"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery' and public.is_admin())
with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "admin_delete_gallery_storage" on storage.objects;
create policy "admin_delete_gallery_storage"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery' and public.is_admin());
