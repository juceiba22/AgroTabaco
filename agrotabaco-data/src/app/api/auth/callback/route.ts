import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
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

    const targetUrl = new URL(redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`, origin);
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
              response.cookies.set(name, value, options)
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
