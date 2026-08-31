-- Log + límite de uso del asistente de IA del Mercado Argentino de Tabaco
-- (src/app/api/mercado/asistente/route.ts). El endpoint es público (no
-- requiere login, para que un visitante pueda consultar precios antes de
-- registrarse), así que necesita un freno propio contra abuso de costo de
-- la API de Gemini: esta tabla + dos funciones SECURITY DEFINER hacen de
-- límite diario por IP (o por usuario, si está logueado).
--
-- Sin policies de select/insert directas para clientes: todo pasa por las
-- funciones de abajo, que corren con los privilegios de quien las creó
-- (no del caller), así ni anon ni authenticated pueden leer/insertar filas
-- ajenas directamente.

create table if not exists public.ai_chat_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  user_id uuid references public.profiles(id) on delete set null,
  ip_hash text,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_logs_ip_hash_created_at_idx
  on public.ai_chat_logs (ip_hash, created_at desc);
create index if not exists ai_chat_logs_user_id_created_at_idx
  on public.ai_chat_logs (user_id, created_at desc);

alter table public.ai_chat_logs enable row level security;

create policy "Chat IA: admin audita todo"
  on public.ai_chat_logs for select
  to authenticated
  using (public.is_admin());

create or replace function public.log_chat_message(
  p_session_id uuid,
  p_ip_hash text,
  p_role text,
  p_content text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_chat_logs (session_id, user_id, ip_hash, role, content)
  values (p_session_id, auth.uid(), p_ip_hash, p_role, p_content);
end;
$$;

create or replace function public.check_chat_rate_limit(
  p_ip_hash text,
  p_daily_limit int default 40
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select (
    select count(*) from public.ai_chat_logs
    where role = 'user'
      and created_at > now() - interval '24 hours'
      and (
        (auth.uid() is not null and user_id = auth.uid())
        or (auth.uid() is null and ip_hash = p_ip_hash)
      )
  ) < p_daily_limit;
$$;

grant execute on function public.log_chat_message(uuid, text, text, text) to anon, authenticated;
grant execute on function public.check_chat_rate_limit(text, int) to anon, authenticated;
