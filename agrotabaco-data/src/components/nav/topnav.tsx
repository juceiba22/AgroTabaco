"use client";

import { FlaskConical, Globe2, Landmark, Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/entitlements";
import type { User } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agro-tabaco.vercel.app";

const PANELS = [
  { href: "/laboratorio", label: "Laboratorio Estadístico", icon: FlaskConical },
  { href: "/tabacostats", label: "TabacoStats Argentina", icon: Sprout },
  { href: "/mercado-internacional", label: "Mercado Internacional", icon: Globe2 },
  { href: "/observatorio-fet", label: "Observatorio del FET", icon: Landmark },
];

const PLAN_LABEL: Record<Plan, string> = { anonymous: "", free: "Free", pro: "PRO" };

export function TopNav({ user, plan }: { user: User | null; plan: Plan }) {
  const pathname = usePathname();
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";

  return (
    <div className="mb-6 border-b border-border pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <a
          href={SITE_URL}
          className="agrotabaco-topbar-brand inline-flex items-center gap-2 text-xl font-bold text-brand-green-dark"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-green-dark text-white">
            <Landmark className="size-4" />
          </span>
          AgroTabaco <span className="text-brand-olive">Data</span>
        </a>

        <div className="flex flex-wrap items-center gap-3">
          <a href={SITE_URL} className="text-sm font-semibold text-muted-foreground hover:text-brand-green-dark">
            ← Volver al portal de noticias
          </a>
          {plan !== "pro" && (
            <Link href="/planes" className="text-sm font-semibold text-amber-700 hover:text-amber-800">
              Ver planes
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{displayName}</span>
              <span
                className={cn(
                  "coverage-badge",
                  plan === "pro" && "bg-brand-green-dark text-white"
                )}
              >
                {PLAN_LABEL[plan]}
              </span>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-brand-green-dark hover:text-brand-green-dark"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-brand-green-dark px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-green-darker"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2">
        {PANELS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-brand-green-dark bg-brand-green-dark text-white"
                  : "border-border bg-card text-muted-foreground hover:border-brand-green-dark hover:text-brand-green-dark"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
