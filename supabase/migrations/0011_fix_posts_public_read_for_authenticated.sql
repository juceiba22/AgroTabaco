-- Fix: cualquier usuario logueado que no sea admin (ej. un trader del
-- Mercado, o cualquier cuenta de Supabase Auth) veía el portal público
-- (home, categorías) completamente vacío.
--
-- Causa: la policy "Noticias: lectura pública de publicadas" de
-- 0001_init.sql quedó alcanzada solo `to anon`. Postgres RLS evalúa
-- policies por rol exacto — un usuario autenticado no cae bajo una policy
-- `to anon`, ni siquiera para leer datos publicados. La única policy que sí
-- alcanza al rol `authenticated` es "Noticias: lectura total para admin"
-- (0002_profiles_and_admin_rls.sql), que exige is_admin() = true. Resultado:
-- cualquier sesión autenticada que no sea admin no ve ni una sola noticia
-- publicada, aunque el resto del sitio esté funcionando normalmente.
--
-- Fix: la misma policy pública de lectura, pero alcanzando también a
-- `authenticated` (mismo patrón que ya usa "Categorías: lectura pública").
-- Se combina con OR junto a la policy de admin — un admin sigue viendo todo
-- (incluidos borradores), y ahora cualquier otro usuario logueado ve lo
-- mismo que ve un visitante anónimo: solo lo publicado.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0010.

drop policy if exists "Noticias: lectura pública de publicadas" on public.posts;

create policy "Noticias: lectura pública de publicadas"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');
