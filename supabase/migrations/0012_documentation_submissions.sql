-- Solicitud de documentación — Persona Jurídica (financiamiento en el Mercado
-- de Valores). Ver src/app/(public)/documentacion-persona-juridica.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0002 (usa
-- public.is_admin()).
--
-- Modelo:
--   * documentation_submissions: un envío por empresa (datos de contacto +
--     "líneas solicitadas": monto, plazo, destino).
--   * documentation_files: un registro por archivo subido, apuntando al
--     objeto en Storage.
--   * Bucket PRIVADO "documentacion": sólo imágenes y PDF, máx. 10 MB por
--     archivo. El alta es pública (los productores no necesitan cuenta), pero
--     sólo el admin puede leer/borrar. Los archivos se guardan bajo
--     {submission_id}/{document_key}/{archivo}.

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------
create table if not exists public.documentation_submissions (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null check (char_length(company_name) between 1 and 200),
  cuit text not null check (char_length(cuit) between 11 and 13),
  contact_name text not null check (char_length(contact_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 50),
  is_sa boolean not null default false,
  requested_amount text check (char_length(requested_amount) <= 200),
  requested_term text check (char_length(requested_term) <= 200),
  requested_purpose text check (char_length(requested_purpose) <= 2000),
  notes text check (char_length(notes) <= 2000),
  status text not null default 'nuevo' check (status in ('nuevo', 'en_revision', 'completo', 'descartado')),
  created_at timestamptz not null default now()
);

create index if not exists documentation_submissions_created_at_idx
  on public.documentation_submissions (created_at desc);

create table if not exists public.documentation_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.documentation_submissions(id) on delete cascade,
  document_key text not null check (
    document_key in (
      'estatuto_acta',
      'ddjj_bienes',
      'estados_contables',
      'ventas_post_balance',
      'deudas_post_balance',
      'dni_socios',
      'certificado_mipyme',
      'libro_accionistas',
      'lineas_solicitadas'
    )
  ),
  storage_path text not null unique,
  file_name text not null check (char_length(file_name) <= 300),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  created_at timestamptz not null default now(),
  check (storage_path like submission_id::text || '/%')
);

create index if not exists documentation_files_submission_idx
  on public.documentation_files (submission_id);

alter table public.documentation_submissions enable row level security;
alter table public.documentation_files enable row level security;

-- Alta pública (sin select: el productor no puede leer lo de otros).
create policy "Documentación: alta pública de envíos"
  on public.documentation_submissions for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "Documentación: alta pública de archivos"
  on public.documentation_files for insert
  to anon, authenticated
  with check (true);

create policy "Documentación: admin gestiona envíos"
  on public.documentation_submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Documentación: admin gestiona archivos"
  on public.documentation_files for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: bucket privado "documentacion"
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documentacion',
  'documentacion',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Subida: cualquiera, pero sólo dentro de una carpeta {uuid}/{document_key}/.
create policy "Documentación: subida pública"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'documentacion'
    and (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    and array_length(storage.foldername(name), 1) = 2
  );

-- Lectura/borrado: sólo admin (se accede con URLs firmadas).
create policy "Documentación: admin gestiona archivos del bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'documentacion' and public.is_admin())
  with check (bucket_id = 'documentacion' and public.is_admin());
