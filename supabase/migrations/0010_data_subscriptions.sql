-- AgroTabaco Data — Fase 2: tabla de suscripciones para el producto premium
-- (agrotabaco-data/). 1 fila por usuario, creada/actualizada por el webhook
-- de Mercado Pago (Fase 4, con la service_role key) — nunca por el propio
-- usuario. Si no existe fila para un usuario, se lo trata como plan "free"
-- (no hace falta un trigger que la cree de entrada).
--
-- Mismo patrón de RLS que profiles/is_admin() (0002_profiles_and_admin_rls.sql):
-- lectura de la fila propia, sin policy de escritura para el usuario.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0009.

create table if not exists public.data_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'free' check (status in ('free', 'active', 'expired', 'cancelled')),
  plan text not null default 'anual',
  current_period_end timestamptz,
  mercadopago_subscription_id text,
  mercadopago_payer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists data_subscriptions_user_id_idx on public.data_subscriptions (user_id);

alter table public.data_subscriptions enable row level security;

drop trigger if exists data_subscriptions_set_updated_at on public.data_subscriptions;
create trigger data_subscriptions_set_updated_at
  before update on public.data_subscriptions
  for each row
  execute function public.set_updated_at();

create policy "Suscripciones AgroTabaco Data: cada usuario ve la propia"
  on public.data_subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- Sin policy de insert/update/delete para el usuario a propósito: esas
-- escrituras las hace el webhook de Mercado Pago con la service_role key
-- (bypassa RLS), nunca el usuario ni el cliente anon/authenticated.

create or replace function public.has_active_data_subscription()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.data_subscriptions
    where user_id = auth.uid()
      and status = 'active'
      and current_period_end is not null
      and current_period_end > now()
  );
$$;
