-- Corrige un bug de la migración 0003: seller_id/buyer_id habían quedado
-- apuntando a auth.users(id) en vez de public.profiles(id) (ver comentario
-- en 0003_marketplace.sql). PostgREST necesita el FK apuntando a profiles
-- para poder embeber el perfil del vendedor/comprador en las consultas del
-- marketplace — sin esto, /mercado tira "Could not find a relationship
-- between 'listings' and 'profiles'".
--
-- Seguro de correr: no hay filas todavía en listings/listing_interests (el
-- marketplace nunca llegó a funcionar con el FK viejo), así que no hay
-- datos que puedan violar el nuevo constraint.
--
-- Correr una sola vez en el SQL Editor de Supabase, después de 0002, 0003 y
-- 0004 (que vos ya corriste).

alter table public.listings
  drop constraint if exists listings_seller_id_fkey;
alter table public.listings
  add constraint listings_seller_id_fkey
  foreign key (seller_id) references public.profiles(id) on delete cascade;

alter table public.listing_interests
  drop constraint if exists listing_interests_buyer_id_fkey;
alter table public.listing_interests
  add constraint listing_interests_buyer_id_fkey
  foreign key (buyer_id) references public.profiles(id) on delete cascade;
