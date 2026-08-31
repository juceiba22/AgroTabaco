-- Esquema inicial: categorías, noticias, RLS y bucket de imágenes.
-- Pensado para correr una sola vez en el SQL Editor de Supabase
-- (Project > SQL Editor > New query > pegar y ejecutar).

-- ---------------------------------------------------------------------------
-- Extensión para generar UUIDs
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tabla: categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categorías: lectura pública"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Categorías: escritura solo autenticados"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Tabla: posts
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Redacción AgroTabaco',
  status text not null default 'draft' check (status in ('published', 'draft')),
  featured boolean not null default false,
  views integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_category_id_idx on public.posts (category_id);
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_published_at_idx on public.posts (published_at desc);

alter table public.posts enable row level security;

create policy "Noticias: lectura pública de publicadas"
  on public.posts for select
  to anon
  using (status = 'published');

create policy "Noticias: lectura total para autenticados"
  on public.posts for select
  to authenticated
  using (true);

create policy "Noticias: escritura solo autenticados"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "Noticias: actualización solo autenticados"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

create policy "Noticias: borrado solo autenticados"
  on public.posts for delete
  to authenticated
  using (true);

-- Mantiene updated_at al día en cada UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Bucket de imágenes: media
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Media: lectura pública"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Media: subida solo autenticados"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "Media: actualización solo autenticados"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "Media: borrado solo autenticados"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ---------------------------------------------------------------------------
-- Seed: categorías reales del sitio (agrotabaco.com)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Tabaco', 'tabaco'),
  ('Novedades', 'novedades'),
  ('Economías Regionales', 'economias-regionales'),
  ('Bioeconomía', 'bioeconomia')
on conflict (slug) do nothing;
