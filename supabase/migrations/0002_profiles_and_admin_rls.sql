-- Perfiles + roles (admin/trader) y blindaje de las políticas RLS existentes.
--
-- Hoy `posts`, `categories` y el bucket `media` tienen políticas
-- `to authenticated using(true)`: cualquier usuario logueado es tratado como
-- admin del CMS de noticias. Esto es correcto mientras el único modo de
-- autenticarse sea el login de /admin, pero deja de serlo en cuanto se
-- habilita alta pública de cuenta para el marketplace (Mercado Argentino de
-- Tabaco). Esta migración introduce `profiles.role` y reescribe esas
-- políticas para exigir rol admin explícito.
--
-- Correr una sola vez en el SQL Editor de Supabase (Project > SQL Editor),
-- después de 0001_init.sql. IMPORTANTE: después de correrla, promover al
-- admin existente corriendo (una sola vez, reemplazando el email real):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'EMAIL_DEL_ADMIN');

-- ---------------------------------------------------------------------------
-- Tabla: profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'trader' check (role in ('admin', 'trader')),
  full_name text,
  company_name text,
  phone text,
  province text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Función helper: is_admin()
--
-- SECURITY DEFINER + creada por el rol que corre esta migración (dueño de
-- profiles), así el select interno no recursiona sobre la RLS de profiles.
-- No poner FORCE ROW LEVEL SECURITY en profiles o esto se rompe.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Trigger: bloquea auto-promoción de rol
--
-- La policy de UPDATE por sí sola no puede diferenciar NEW.role de
-- OLD.role, así que sin este trigger un trader podría hacer
-- `update profiles set role='admin' where id=auth.uid()` y neutralizar todo
-- el resto de esta migración.
-- ---------------------------------------------------------------------------
create or replace function public.lock_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_lock_role on public.profiles;
create trigger profiles_lock_role
  before update on public.profiles
  for each row
  execute function public.lock_profile_role();

-- ---------------------------------------------------------------------------
-- Trigger: crea el profile automáticamente al registrarse
--
-- Puebla full_name/company_name/phone/province desde
-- supabase.auth.signUp({ options: { data: {...} } }); ver
-- src/app/(public)/mercado/registro/page.tsx (commit 3 del plan).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company_name, phone, province)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'province'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS: profiles
--
-- No hay policy de INSERT a propósito: las filas sólo las crea el trigger
-- SECURITY DEFINER de arriba, nunca directamente un usuario.
-- ---------------------------------------------------------------------------
create policy "Perfiles: cada usuario ve el propio"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Perfiles: admin ve todos"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "Perfiles: actualización propia"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Nota: la policy que deja ver el perfil de la contraparte de un
-- listing_interests (comprador <-> vendedor) se agrega en
-- 0003_marketplace.sql, porque depende de tablas que todavía no existen acá.

-- ---------------------------------------------------------------------------
-- Reescritura: categories (antes "to authenticated using(true)")
-- ---------------------------------------------------------------------------
drop policy if exists "Categorías: escritura solo autenticados" on public.categories;

create policy "Categorías: escritura solo admin"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Reescritura: posts (antes "to authenticated using(true)")
-- ---------------------------------------------------------------------------
drop policy if exists "Noticias: lectura total para autenticados" on public.posts;
drop policy if exists "Noticias: escritura solo autenticados" on public.posts;
drop policy if exists "Noticias: actualización solo autenticados" on public.posts;
drop policy if exists "Noticias: borrado solo autenticados" on public.posts;

create policy "Noticias: lectura total para admin"
  on public.posts for select
  to authenticated
  using (public.is_admin());

create policy "Noticias: creación solo admin"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

create policy "Noticias: actualización solo admin"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Noticias: borrado solo admin"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Reescritura: storage.objects, bucket "media"
--
-- Antes "to authenticated using(true)" para insert/update/delete (cualquier
-- logueado podía escribir en todo el bucket). Ahora: admin sigue con acceso
-- total (portadas de noticias); los traders del marketplace sólo pueden
-- escribir dentro de su propia carpeta listings/{auth.uid()}/... (fotos de
-- ofertas, ver commit 5 del plan). Sin esto, el upload de imágenes de
-- ofertas quedaría roto por este mismo fix de seguridad.
-- ---------------------------------------------------------------------------
drop policy if exists "Media: subida solo autenticados" on storage.objects;
drop policy if exists "Media: actualización solo autenticados" on storage.objects;
drop policy if exists "Media: borrado solo autenticados" on storage.objects;

create policy "Media: admin gestiona todo el bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "Media: traders suben imágenes de sus ofertas"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "Media: traders actualizan imágenes propias"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = auth.uid()::text
  )
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

create policy "Media: traders borran imágenes propias"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = 'listings'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
