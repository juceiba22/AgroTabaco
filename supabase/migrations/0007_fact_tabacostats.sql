-- Datos de "TabacoStats Argentina": producción primaria, calidad/clases
-- comerciales, acopio por empresas, precios de acopio + FET, mercado
-- internacional (Virginia/Burley) y precio FET por resolución. Reemplazan
-- los CSV que hoy lee el dashboard Streamlit en
-- mercado-argentino-tabaco/app.py — segundo tramo de la migración a Next.js
-- nativo (tabacostats-nativo/), después del piloto Laboratorio Estadístico.
--
-- Igual que en 0006: los datos ya vienen limpios (provincia/variedad/razón
-- social normalizadas vía sanitize_province/sanitize_tobacco/
-- clean_company_name, campos derivados como anio_inicio/produccion_tn/
-- volumen_tn ya calculados, la corrección de escala de unidades de
-- fact_acopio_empresas ya aplicada) — toda esa limpieza se hace una sola
-- vez al generar supabase/seed_tabacostats.sql, no en cada consulta.
--
-- Lectura pública, escritura solo admin — mismo patrón que 0006, reusa
-- public.is_admin() de 0002.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0006.
-- Después correr supabase/seed_tabacostats.sql para cargar los datos.

create table if not exists public.fact_produccion_primaria (
  id uuid primary key default gen_random_uuid(),
  campana text not null,
  anio_inicio integer not null,
  provincia text not null,
  tipo_tabaco text not null,
  ambito text not null check (ambito in ('PROVINCIAL', 'NACIONAL')),
  es_total boolean not null default false,
  sup_sembrada_ha numeric,
  sup_cosechada_ha numeric,
  produccion_kg numeric,
  produccion_tn numeric,
  rendimiento_kg_ha numeric,
  precio_acopio_unitario numeric,
  precio_fet_unitario numeric,
  precio_total_unitario numeric,
  valor_total_estimado numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_produccion_primaria_campana_idx on public.fact_produccion_primaria (anio_inicio);

alter table public.fact_produccion_primaria enable row level security;

drop trigger if exists fact_produccion_primaria_set_updated_at on public.fact_produccion_primaria;
create trigger fact_produccion_primaria_set_updated_at
  before update on public.fact_produccion_primaria
  for each row
  execute function public.set_updated_at();

create policy "Producción primaria: lectura pública"
  on public.fact_produccion_primaria for select
  to anon, authenticated
  using (true);

create policy "Producción primaria: escritura solo admin"
  on public.fact_produccion_primaria for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_acopio_clases (
  id uuid primary key default gen_random_uuid(),
  campana text not null,
  anio_inicio integer not null,
  provincia text not null,
  tipo_tabaco text not null,
  clase_comercial text not null,
  es_total_clase boolean not null default false,
  volumen_kg numeric not null default 0,
  volumen_tn numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_acopio_clases_campana_idx on public.fact_acopio_clases (anio_inicio);

alter table public.fact_acopio_clases enable row level security;

drop trigger if exists fact_acopio_clases_set_updated_at on public.fact_acopio_clases;
create trigger fact_acopio_clases_set_updated_at
  before update on public.fact_acopio_clases
  for each row
  execute function public.set_updated_at();

create policy "Acopio por clases: lectura pública"
  on public.fact_acopio_clases for select
  to anon, authenticated
  using (true);

create policy "Acopio por clases: escritura solo admin"
  on public.fact_acopio_clases for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_acopio_empresas (
  id uuid primary key default gen_random_uuid(),
  campana text not null,
  anio_inicio integer not null,
  provincia text not null,
  tipo_tabaco text not null,
  razon_social text not null,
  es_subtotal_empresa boolean not null default false,
  volumen_acopio_kg numeric not null default 0,
  volumen_tn numeric not null default 0,
  valor_acopio_pesos numeric not null default 0,
  precio_promedio_empresa numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_acopio_empresas_campana_idx on public.fact_acopio_empresas (anio_inicio);

alter table public.fact_acopio_empresas enable row level security;

drop trigger if exists fact_acopio_empresas_set_updated_at on public.fact_acopio_empresas;
create trigger fact_acopio_empresas_set_updated_at
  before update on public.fact_acopio_empresas
  for each row
  execute function public.set_updated_at();

create policy "Acopio por empresas: lectura pública"
  on public.fact_acopio_empresas for select
  to anon, authenticated
  using (true);

create policy "Acopio por empresas: escritura solo admin"
  on public.fact_acopio_empresas for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_acopio_precios (
  id uuid primary key default gen_random_uuid(),
  campana text not null,
  anio_inicio integer not null,
  provincia text not null,
  tipo_tabaco text not null,
  es_subtotal_provincial boolean not null default false,
  es_total_nacional boolean not null default false,
  volumen_kg numeric not null default 0,
  volumen_tn numeric not null default 0,
  valor_acopio_pesos numeric not null default 0,
  precio_acopio_promedio numeric not null default 0,
  valor_fet_pesos numeric not null default 0,
  precio_fet_promedio numeric not null default 0,
  valor_total_pesos numeric not null default 0,
  precio_total_promedio numeric not null default 0,
  pct_fet numeric not null default 0,
  pct_acopio numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_acopio_precios_campana_idx on public.fact_acopio_precios (anio_inicio);

alter table public.fact_acopio_precios enable row level security;

drop trigger if exists fact_acopio_precios_set_updated_at on public.fact_acopio_precios;
create trigger fact_acopio_precios_set_updated_at
  before update on public.fact_acopio_precios
  for each row
  execute function public.set_updated_at();

create policy "Precios de acopio: lectura pública"
  on public.fact_acopio_precios for select
  to anon, authenticated
  using (true);

create policy "Precios de acopio: escritura solo admin"
  on public.fact_acopio_precios for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------

create table if not exists public.fact_mercado_internacional (
  id uuid primary key default gen_random_uuid(),
  variety text not null check (variety in ('Virginia', 'Burley')),
  year integer not null,
  value_usd numeric not null,
  is_ytd boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_mercado_internacional_year_idx on public.fact_mercado_internacional (year);

alter table public.fact_mercado_internacional enable row level security;

drop trigger if exists fact_mercado_internacional_set_updated_at on public.fact_mercado_internacional;
create trigger fact_mercado_internacional_set_updated_at
  before update on public.fact_mercado_internacional
  for each row
  execute function public.set_updated_at();

create policy "Mercado internacional: lectura pública"
  on public.fact_mercado_internacional for select
  to anon, authenticated
  using (true);

create policy "Mercado internacional: escritura solo admin"
  on public.fact_mercado_internacional for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Precio FET por resolución (resumen_precios_tabaco_con_dolares.csv) — la
-- pestaña "Precio FET" ya fue rediseñada esta sesión (selector Variedad+
-- Clase obligatorio, área apilada, comparativo por campaña, detalle de
-- resoluciones); esta tabla es simplemente su fuente de datos en Supabase.
-- ---------------------------------------------------------------------------

create table if not exists public.fact_precio_resoluciones (
  id uuid primary key default gen_random_uuid(),
  campana text not null,
  etapa_pago text,
  fecha date,
  archivo_origen text not null,
  tabaco text not null,
  clase text,
  porcentaje numeric,
  adelanto_1 numeric,
  adelanto_2 numeric,
  incremento numeric,
  precio_total_acumulado numeric,
  adelanto_1_usd numeric,
  adelanto_2_usd numeric,
  incremento_usd numeric,
  precio_total_acumulado_usd numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fact_precio_resoluciones_tabaco_clase_idx
  on public.fact_precio_resoluciones (tabaco, clase);
create index if not exists fact_precio_resoluciones_campana_idx on public.fact_precio_resoluciones (campana);

alter table public.fact_precio_resoluciones enable row level security;

drop trigger if exists fact_precio_resoluciones_set_updated_at on public.fact_precio_resoluciones;
create trigger fact_precio_resoluciones_set_updated_at
  before update on public.fact_precio_resoluciones
  for each row
  execute function public.set_updated_at();

create policy "Precio FET por resolución: lectura pública"
  on public.fact_precio_resoluciones for select
  to anon, authenticated
  using (true);

create policy "Precio FET por resolución: escritura solo admin"
  on public.fact_precio_resoluciones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
