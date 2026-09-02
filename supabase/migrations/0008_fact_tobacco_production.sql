-- Producción mundial de tabaco (FAOstat / Our World in Data, 1961-2024).
-- Reemplaza mercado-global-tabaco/FAOstat/tobacco-production.csv — tercer y
-- último tramo de la migración de los dashboards Streamlit a Next.js nativo
-- (mercado-global-nativo/), después de laboratorio-nativo y tabacostats-nativo.
--
-- Igual que en 0006/0007: entity_type y entity_display ya vienen resueltos
-- (clasificación país/agregado + nombre bilingüe con bandera) al generar
-- supabase/seed_tobacco_production.sql — esa lógica no se repite en cada
-- consulta. Lectura pública, escritura solo admin, reusa public.is_admin().
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0007.
-- Después correr supabase/seed_tobacco_production.sql para cargar los datos
-- (~10.700 filas — el fetch en la app pagina con .range(), no es un select
-- simple, porque supera el límite default de 1000 filas de PostgREST).

create table if not exists public.fact_tobacco_production (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  code text,
  year integer not null,
  value_tonnes numeric not null default 0,
  entity_type text not null check (entity_type in ('Country', 'Aggregate')),
  entity_display text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_tobacco_production_year_idx on public.fact_tobacco_production (year);
create index if not exists fact_tobacco_production_entity_idx on public.fact_tobacco_production (entity);

alter table public.fact_tobacco_production enable row level security;

drop trigger if exists fact_tobacco_production_set_updated_at on public.fact_tobacco_production;
create trigger fact_tobacco_production_set_updated_at
  before update on public.fact_tobacco_production
  for each row
  execute function public.set_updated_at();

create policy "Producción mundial de tabaco: lectura pública"
  on public.fact_tobacco_production for select
  to anon, authenticated
  using (true);

create policy "Producción mundial de tabaco: escritura solo admin"
  on public.fact_tobacco_production for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
