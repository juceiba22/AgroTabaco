import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  const host = request.headers.get("host");
  if (host) {
    const proto = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    return `${proto}://${host}`;
  }
  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? searchParams.get("next") ?? "/laboratorio";

  if (code) {
    // Preserve any extra query params except auth specific ones
    const forwardParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "code" && key !== "redirectTo" && key !== "next") {
        forwardParams.set(key, value);
      }
    });

    const cleanRedirect = redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`;
    const targetUrl = new URL(cleanRedirect, origin);
    forwardParams.forEach((value, key) => targetUrl.searchParams.set(key, value));

    const response = NextResponse.redirect(targetUrl.toString());

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, {
                ...options,
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
              })
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
    console.error("[agrotabaco-data/auth-callback] Error canjeando código por sesión:", error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
