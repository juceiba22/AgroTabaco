-- Esquema del marketplace "Mercado Argentino de Tabaco": ofertas de compra/
-- venta de tabaco verde (por clase comercial) y procesado (por posición
-- arancelaria HS, Virginia/Burley), interés expresado sobre esas ofertas, y
-- una lista de espera para la futura ronda de financiamiento por
-- tokenización. Depende de 0002_profiles_and_admin_rls.sql (usa
-- public.is_admin() y public.set_updated_at()).
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0002.

-- ---------------------------------------------------------------------------
-- Tabla: listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  -- Referencia a profiles (no directamente a auth.users): profiles.id ya es
  -- 1:1 con auth.users.id, y así PostgREST puede embeber el perfil del
  -- vendedor en las consultas (select "*, profiles(...)"), cosa que no
  -- puede hacer contra el esquema auth. El trigger handle_new_user de
  -- 0002 garantiza que el profile exista para cualquier usuario logueado.
  seller_id uuid not null references public.profiles(id) on delete cascade,
  listing_type text not null check (listing_type in ('venta', 'compra')),
  product_type text not null check (product_type in ('verde', 'procesado')),
  title text not null,
  -- Variedades reales relevadas del acopio histórico (acopio_historico_unificado.csv).
  -- Excluye filas agregadas como "TOTAL"/"TOTAL NACIONAL".
  variety text not null check (variety in (
    'VIRGINIA', 'BURLEY', 'CRIOLLO MISIONERO', 'CRIOLLO CORRENTINO',
    'CRIOLLO CHAQUEÑO', 'CRIOLLO ARGENTINO', 'CRIOLLO SALTEÑO',
    'KENTUCKY', 'KENTUCKY AHUMADO'
  )),
  -- Clase comercial (B1F, C1F, X1F, T1L, etc.) sólo aplica a tabaco verde.
  -- Hay 60+ códigos reales y variantes válidas, así que queda como texto
  -- libre en vez de un CHECK rígido; la UI sugiere las más comunes desde
  -- src/lib/marketplace/constants.ts (TRADING_CLASSES).
  trading_class text,
  -- Posición arancelaria HS-10 (EE.UU., Census/USDA GATS) sólo aplica a
  -- tabaco procesado. Los 10 códigos del anexo Virginia/Burley: mantener
  -- sincronizado a mano con HS_CODES en src/lib/marketplace/constants.ts.
  hs_code text check (hs_code is null or hs_code in (
    '2401208005', '2401208010', '2401208011', '2401202810', '2401105130',
    '2401208015', '2401208020', '2401208021', '2401202820', '2401105160'
  )),
  quantity numeric not null check (quantity > 0),
  unit text not null check (unit in ('kg', 'ton')),
  price numeric check (price is null or price >= 0),
  currency text not null default 'USD',
  price_unit text check (price_unit in ('por_kg', 'total')),
  -- Provincias productoras reales relevadas del acopio histórico.
  province text not null check (province in (
    'CATAMARCA', 'CHACO', 'CORRIENTES', 'JUJUY', 'MISIONES', 'SALTA', 'TUCUMAN'
  )),
  description text not null default '',
  cover_image text,
  status text not null default 'activa' check (status in ('activa', 'pausada', 'cerrada')),
  -- Flag de moderación del admin, separado del status que controla el
  -- vendedor: permite ocultar una publicación por spam/abuso sin pisar el
  -- estado que el propio vendedor le dio (activa/pausada/cerrada).
  admin_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_class_or_hs check (
    (product_type = 'verde' and hs_code is null)
    or (product_type = 'procesado' and trading_class is null)
  ),
  constraint listings_price_needs_unit check (price is null or price_unit is not null)
);

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_product_type_idx
  on public.listings (product_type, status, created_at desc);
create index if not exists listings_seller_id_idx on public.listings (seller_id);

alter table public.listings enable row level security;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row
  execute function public.set_updated_at();

create policy "Ofertas: lectura pública de activas"
  on public.listings for select
  to anon, authenticated
  using (status = 'activa' and not admin_hidden);

create policy "Ofertas: el vendedor ve todas las propias"
  on public.listings for select
  to authenticated
  using (seller_id = auth.uid());

create policy "Ofertas: admin ve todas"
  on public.listings for select
  to authenticated
  using (public.is_admin());

create policy "Ofertas: creación propia"
  on public.listings for insert
  to authenticated
  with check (seller_id = auth.uid());

create policy "Ofertas: actualización propia o admin"
  on public.listings for update
  to authenticated
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());

create policy "Ofertas: borrado propio o admin"
  on public.listings for delete
  to authenticated
  using (seller_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Tabla: listing_interests
--
-- Registro inmutable de "estoy interesado" sobre una oferta. Sin
-- update/delete en v1: es un log, no un chat.
-- ---------------------------------------------------------------------------
create table if not exists public.listing_interests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  -- Idem seller_id arriba: referencia profiles, no auth.users, para poder
  -- embeber el perfil del comprador en las consultas de PostgREST.
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  message text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists listing_interests_listing_id_idx
  on public.listing_interests (listing_id);
create index if not exists listing_interests_buyer_id_idx
  on public.listing_interests (buyer_id);

alter table public.listing_interests enable row level security;

create policy "Interés: crear propio"
  on public.listing_interests for insert
  to authenticated
  with check (buyer_id = auth.uid());

create policy "Interés: comprador ve lo propio"
  on public.listing_interests for select
  to authenticated
  using (buyer_id = auth.uid());

create policy "Interés: vendedor ve interés en sus ofertas"
  on public.listing_interests for select
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_interests.listing_id and l.seller_id = auth.uid()
    )
  );

create policy "Interés: admin ve todo"
  on public.listing_interests for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Perfiles: ahora que existen listings/listing_interests, dejamos ver el
-- perfil (nombre, empresa, teléfono) de la contraparte de un interés
-- expresado — sin esto, comprador y vendedor no podrían identificarse para
-- cerrar el trato fuera de la plataforma.
-- ---------------------------------------------------------------------------
create policy "Perfiles: contraparte visible por interés expresado"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.listing_interests li
      join public.listings l on l.id = li.listing_id
      where (li.buyer_id = auth.uid() and l.seller_id = profiles.id)
         or (l.seller_id = auth.uid() and li.buyer_id = profiles.id)
    )
  );

-- ---------------------------------------------------------------------------
-- Tabla: financing_interests
--
-- Lista de espera para la futura ronda de financiamiento por tokenización
-- (el smart contract/token se integra más adelante, ver
-- src/app/(public)/mercado/financiamiento/page.tsx). Alta pública: no
-- forzamos registro sólo para dejar el lead.
-- ---------------------------------------------------------------------------
create table if not exists public.financing_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  company_name text,
  phone text,
  interest_amount numeric,
  message text,
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'descartado')),
  created_at timestamptz not null default now()
);

create index if not exists financing_interests_created_at_idx
  on public.financing_interests (created_at desc);

alter table public.financing_interests enable row level security;

create policy "Financiamiento: alta pública"
  on public.financing_interests for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "Financiamiento: el usuario ve lo propio"
  on public.financing_interests for select
  to authenticated
  using (user_id = auth.uid());

create policy "Financiamiento: admin gestiona todo"
  on public.financing_interests for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
