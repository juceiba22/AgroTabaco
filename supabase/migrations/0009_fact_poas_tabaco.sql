-- Observatorio del FET: Planes Operativos Anuales (POAs) financiados con el
-- Fondo Especial del Tabaco (Ley Nº 19.800) a favor de las provincias
-- tabacaleras. 1 fila = 1 Resolución/Anexo fuente (ver
-- observatorio-fet-nativo/scripts/build_seed_sql.py para la limpieza aplicada
-- sobre "observatorio-fet-data/base_datos_poas_tabaco_local.csv").
-- Mismo patrón de RLS lectura-pública / escritura-admin que 0001-0008,
-- reutilizando public.is_admin() (definida en 0002) y public.set_updated_at()
-- (definida en 0001).
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0008. Después
-- correr supabase/seed_poas_tabaco.sql para cargar los datos (~2.737 filas —
-- el fetch en la app pagina con .range(), igual que fact_tobacco_production,
-- porque supera el límite default de 1000 filas de PostgREST).

create table if not exists public.fact_poas_tabaco (
  id uuid primary key default gen_random_uuid(),
  archivo_origen text not null,
  provincia text not null,
  provincia_display text not null,
  anio_resolucion integer not null,
  fecha date,
  campana_display text,
  norma text,
  nro_expediente text,
  componente text,
  subcomponente text,
  objeto_programa text,
  tipo_asistencia text,
  modalidad_desembolso text,
  zona_o_departamento text,
  monto_ars numeric,
  cotizacion_usd numeric,
  monto_usd numeric,
  organismo_ejecutor text,
  firmante_autoridad text,
  cuenta_bancaria_debito text,
  convenio_marco text,
  es_anexo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_poas_tabaco_anio_resolucion_idx on public.fact_poas_tabaco (anio_resolucion);
create index if not exists fact_poas_tabaco_provincia_idx on public.fact_poas_tabaco (provincia);
create index if not exists fact_poas_tabaco_objeto_programa_idx on public.fact_poas_tabaco (objeto_programa);

alter table public.fact_poas_tabaco enable row level security;

drop trigger if exists fact_poas_tabaco_set_updated_at on public.fact_poas_tabaco;
create trigger fact_poas_tabaco_set_updated_at
  before update on public.fact_poas_tabaco
  for each row
  execute function public.set_updated_at();

create policy "Observatorio del FET: lectura pública"
  on public.fact_poas_tabaco for select
  to anon, authenticated
  using (true);

create policy "Observatorio del FET: escritura solo admin"
  on public.fact_poas_tabaco for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
