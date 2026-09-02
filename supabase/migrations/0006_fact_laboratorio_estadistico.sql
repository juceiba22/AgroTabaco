-- Tablas de datos del "Laboratorio Estadístico": volumen/precios, participación
-- de mercado (Empresas Grandes vs. PyMES) y consumo aparente histórico del
-- mercado interno de tabaco (cigarrillos). Reemplazan los CSV sueltos que
-- hoy lee el dashboard Streamlit en laboratorio-estadistico/app.py — este es
-- el primer paso de migrar ese dashboard (y eventualmente los otros dos) a
-- una app Next.js nativa (laboratorio-nativo/), sin depender de Streamlit.
--
-- Los datos ya vienen limpios y deduplicados (una fila por mes/año) al
-- insertarse — toda la normalización de formatos de fecha y el descarte de
-- filas duplicadas/incompletas (ver parse_mes_es() y el comentario sobre
-- 'may-19' en laboratorio-estadistico/app.py) se hace una sola vez al
-- generar supabase/seed_laboratorio_estadistico.sql, no en cada consulta.
--
-- Lectura pública (igual que categories en 0001_init.sql): son datos de
-- referencia estadística, no contenido administrable por el usuario final.
-- Escritura solo admin, reusando public.is_admin() de 0002.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0005.
-- Después correr supabase/seed_laboratorio_estadistico.sql para cargar los datos.

create table if not exists public.fact_volumen_precios (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  precio_inferior numeric,
  precio_promedio_ponderado numeric,
  precio_superior numeric,
  primer_quartil numeric,
  segundo_quartil numeric,
  tercer_quartil numeric,
  cuarto_quartil numeric,
  total_paquetes numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_volumen_precios_fecha_idx on public.fact_volumen_precios (fecha);

alter table public.fact_volumen_precios enable row level security;

drop trigger if exists fact_volumen_precios_set_updated_at on public.fact_volumen_precios;
create trigger fact_volumen_precios_set_updated_at
  before update on public.fact_volumen_precios
  for each row
  execute function public.set_updated_at();

create policy "Volumen y precios: lectura pública"
  on public.fact_volumen_precios for select
  to anon, authenticated
  using (true);

create policy "Volumen y precios: escritura solo admin"
  on public.fact_volumen_precios for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_participacion_mercado (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  empresas_grandes numeric,
  porcentaje_participacion_grandes numeric,
  empresas_pymes numeric,
  porcentaje_participacion_pymes numeric,
  total_mercado numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_participacion_mercado_fecha_idx on public.fact_participacion_mercado (fecha);

alter table public.fact_participacion_mercado enable row level security;

drop trigger if exists fact_participacion_mercado_set_updated_at on public.fact_participacion_mercado;
create trigger fact_participacion_mercado_set_updated_at
  before update on public.fact_participacion_mercado
  for each row
  execute function public.set_updated_at();

create policy "Participación de mercado: lectura pública"
  on public.fact_participacion_mercado for select
  to anon, authenticated
  using (true);

create policy "Participación de mercado: escritura solo admin"
  on public.fact_participacion_mercado for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_consumo_aparente (
  id uuid primary key default gen_random_uuid(),
  anio smallint not null unique,
  total_paquetes numeric,
  poblacion numeric,
  consumo_aparente numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_consumo_aparente_anio_idx on public.fact_consumo_aparente (anio);

alter table public.fact_consumo_aparente enable row level security;

drop trigger if exists fact_consumo_aparente_set_updated_at on public.fact_consumo_aparente;
create trigger fact_consumo_aparente_set_updated_at
  before update on public.fact_consumo_aparente
  for each row
  execute function public.set_updated_at();

create policy "Consumo aparente: lectura pública"
  on public.fact_consumo_aparente for select
  to anon, authenticated
  using (true);

create policy "Consumo aparente: escritura solo admin"
  on public.fact_consumo_aparente for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
