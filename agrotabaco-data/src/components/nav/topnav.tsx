"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FlaskConical,
  Globe2,
  Landmark,
  Search,
  Sparkles,
  Sprout,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import type { Plan } from "@/lib/entitlements";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agro-tabaco.vercel.app";

const PANELS = [
  { href: "/laboratorio", label: "Laboratorio Estadístico", icon: FlaskConical },
  { href: "/tabacostats", label: "TabacoStats Argentina", icon: Sprout },
  { href: "/mercado-internacional", label: "Mercado Internacional & FOB", icon: Globe2 },
  { href: "/observatorio-fet", label: "Observatorio del FET", icon: Landmark },
];

const PLAN_LABEL: Record<Plan, string> = { anonymous: "", free: "Free", pro: "PRO LEVEL" };

export function TopNav({ user, plan }: { user: SupabaseUser | null; plan: Plan }) {
  const pathname = usePathname();
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* 1. Ticker Bar Superior de Mercados en Vivo */}
      <div className="w-full bg-[#132A1E] text-[#EAF3EC] py-2 px-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs border border-[#1A3B2B]">
        <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap py-0.5 scrollbar-none font-mono text-[11px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#C59B27] animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[#FFDF98] text-[10px]">
              MERCADO FET EN VIVO
            </span>
          </div>
          <span className="text-[#EAF3EC]/30">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#EAF3EC]/70">Virginia Grado 1:</span>
            <span className="font-bold text-white">$3.420,00</span>
            <span className="text-[#C6EBD4] font-bold">▲ +4.2%</span>
          </div>
          <span className="text-[#EAF3EC]/30">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#EAF3EC]/70">Burley Misiones B1:</span>
            <span className="font-bold text-white">$2.890,50</span>
            <span className="text-[#C6EBD4] font-bold">▲ +1.8%</span>
          </div>
          <span className="text-[#EAF3EC]/30">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#EAF3EC]/70">FOB Paranaguá Ref:</span>
            <span className="font-bold text-white">USD 4.85/kg</span>
            <span className="text-[#FFDAD6] font-bold">▼ -0.5%</span>
          </div>
          <span className="text-[#EAF3EC]/30">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#EAF3EC]/70">Dólar BCRA:</span>
            <span className="font-bold text-white">$1.285,40</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-[#C6EBD4]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#C59B27]" />
          <span>Datos Oficiales AFIP / FET / SAGyP</span>
        </div>
      </div>

      {/* 2. Barra Principal de la Terminal */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border/80">
        <div className="flex items-center gap-4">
          <Logo subtext="TERMINAL CUANTITATIVO" />
          <span className="rounded-full bg-[#C59B27]/20 border border-[#C59B27]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#132A1E]">
            v3.0
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={SITE_URL}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4E4635] hover:text-[#132A1E] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#C59B27]" />
            Volver a Noticias
          </a>

          {plan !== "pro" && (
            <Link
              href="/planes"
              className="inline-flex items-center gap-1 rounded-lg bg-[#C59B27] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#151D19] hover:bg-[#EEC14B] transition-colors shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Obtener Pro
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-border">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-[#151D19] max-w-[140px] truncate">
                  {displayName}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#C59B27]">
                  {PLAN_LABEL[plan] || "FREE"}
                </span>
              </div>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-[#132A1E] hover:text-[#132A1E] transition-colors"
                >
                  Salir
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#132A1E] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1A3B2B] transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* 3. Pestañas / Módulos de la Terminal */}
      <nav className="flex flex-wrap items-center gap-2 pt-1">
        {PANELS.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                active
                  ? "bg-[#132A1E] text-white shadow-sm border border-[#132A1E]"
                  : "bg-white border border-border text-[#4E4635] hover:border-[#C59B27] hover:text-[#132A1E] shadow-2xs"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active ? "text-[#C59B27]" : "text-[#506859]")} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
