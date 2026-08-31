import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si faltan las variables de entorno (p. ej. un deploy sin configurar
  // todavía), dejamos pasar la request en vez de tirar abajo todo el sitio
  // con un 500 del middleware. El sitio público queda navegable aunque las
  // páginas que dependen de Supabase van a fallar hasta que se completen
  // las variables en Vercel.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[middleware] Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANTE: no ejecutar lógica entre createServerClient y getUser().
  // Un error simple puede hacer muy difícil debuguear problemas de sesión.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Mercado Argentino de Tabaco: publicar/gestionar ofertas requiere cuenta;
  // el resto de /mercado (explorar, ver detalle, financiamiento) es público.
  const mercadoAuthPaths = ["/mercado/publicar", "/mercado/mis-ofertas"];
  const isMercadoAuthRoute = mercadoAuthPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isMercadoAuthEntry =
    request.nextUrl.pathname.startsWith("/mercado/login") ||
    request.nextUrl.pathname.startsWith("/mercado/registro");

  if (isMercadoAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/mercado/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isMercadoAuthEntry && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/mercado/mis-ofertas";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: siempre devolver el objeto supabaseResponse tal cual.
  return supabaseResponse;
}
