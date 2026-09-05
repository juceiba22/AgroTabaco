"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Clock,
  ExternalLink,
  FileText,
  Menu,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { AGROTABACO_DATA_URL } from "@/lib/config";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

// Ticker de cotizaciones y mercados en vivo
const TICKER_ITEMS = [
  { label: "FET Salta/Jujuy", value: "$3.420/kg", delta: "+3.4%", isPos: true },
  { label: "Virginia B1F Cl.1", value: "US$ 4.82/kg", delta: "+1.1%", isPos: true },
  { label: "Burley C2L", value: "US$ 3.95/kg", delta: "0.0%", isPos: null },
  { label: "Dólar Exportación", value: "$1.285,40", delta: "+0.6%", isPos: true },
  { label: "Soja Rosario", value: "US$ 310/tn", delta: "-0.8%", isPos: false },
  { label: "Maíz Rosario", value: "US$ 182/tn", delta: "+0.5%", isPos: true },
];

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* 1. Barra Superior de Ticker Financiero en Vivo */}
      <div className="w-full bg-[#132A1E] text-[#EAF3EC] py-1 px-4 sm:px-6 lg:px-8 border-b border-[#1A3B2B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#C59B27] animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[#FFDF98] text-[10px]">
              MERCADOS & AGRO
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap font-mono text-[11px] py-0.5 scrollbar-none">
            {TICKER_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 shrink-0">
                <span className="text-[#EAF3EC]/70">{item.label}:</span>
                <span className="font-bold text-white">{item.value}</span>
                {item.delta && (
                  <span
                    className={cn(
                      "font-bold text-[10px] px-1 rounded",
                      item.isPos === true
                        ? "text-[#C6EBD4] bg-[#1A3B2B]"
                        : item.isPos === false
                        ? "text-[#FFDAD6] bg-[#5A1A1A]"
                        : "text-white/60"
                    )}
                  >
                    {item.isPos === true ? "▲" : item.isPos === false ? "▼" : "—"} {item.delta}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[10px] text-[#EAF3EC]/70 shrink-0">
            <Clock className="h-3 w-3 text-[#C59B27]" />
            <span>Cierre NOA: 18:00 ART</span>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal de Navegación & Switcher de Portales */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav categories={categories} />
          <Logo subtext="EDITORIAL & DATA HUB" />
          
          <div className="hidden lg:block h-6 w-px bg-border/80" />

          {/* Switcher Editorial vs Data */}
          <nav className="hidden lg:flex items-center p-1 bg-[#EDF6EF] rounded-lg gap-1">
            <Link
              href="/"
              className={cn(
                "px-3 py-1.5 rounded-md text-xs uppercase font-bold tracking-wider transition-all",
                pathname === "/" || !pathname?.startsWith("/mercado")
                  ? "bg-white text-[#132A1E] shadow-sm"
                  : "text-[#506859] hover:text-[#132A1E]"
              )}
            >
              Noticias & Editorial
            </Link>
            <a
              href={AGROTABACO_DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs uppercase font-bold tracking-wider text-[#506859] hover:text-[#132A1E] transition-all"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#C59B27]" />
              AgroTabaco Data
              <span className="px-1.5 py-0.2 rounded-full bg-[#C59B27] text-[#151D19] text-[9px] font-extrabold">
                LIVE DATA
              </span>
            </a>
          </nav>
        </div>

        {/* Buscador Central */}
        <SearchForm className="hidden flex-1 max-w-sm md:flex" />

        {/* Acciones de la derecha */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Buscar"
            nativeButton={false}
            render={<Link href="/buscar" />}
          >
            <Search className="h-5 w-5 text-[#132A1E]" />
          </Button>

          <a
            href={AGROTABACO_DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#EDF6EF] text-[#132A1E] text-xs font-bold uppercase tracking-wider hover:bg-[#E2EAE4] transition-colors border border-border"
          >
            <FileText className="h-3.5 w-3.5 text-[#C59B27]" />
            Reportes Pro
          </a>

          <a
            href={`${AGROTABACO_DATA_URL}/planes`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C59B27] text-[#151D19] text-xs font-extrabold uppercase tracking-wider hover:bg-[#EEC14B] transition-colors shadow-sm"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Data Pro
          </a>

          <Link
            href="/admin/login"
            className="h-8 w-8 rounded-full bg-[#132A1E] flex items-center justify-center text-white hover:bg-[#1A3B2B] transition-colors"
            title="Acceso Redacción"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 3. Sub-Barra de Categorías & Secciones */}
      <div className="w-full bg-[#EDF6EF]/70 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-10">
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-1 scrollbar-none text-xs">
            <Link
              href="/"
              className={cn(
                "px-2.5 py-1 rounded font-bold uppercase tracking-wider transition-colors",
                pathname === "/"
                  ? "bg-white text-[#132A1E] shadow-xs"
                  : "text-[#4E4635] hover:text-[#132A1E] hover:bg-white/50"
              )}
            >
              Portada
            </Link>
            {categories.map((category) => {
              const active = pathname === `/categoria/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className={cn(
                    "px-2.5 py-1 rounded font-bold uppercase tracking-wider transition-colors",
                    active
                      ? "bg-white text-[#132A1E] shadow-xs"
                      : "text-[#4E4635] hover:text-[#132A1E] hover:bg-white/50"
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
            <a
              href={`${AGROTABACO_DATA_URL}/observatorio-fet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[#4E4635] hover:text-[#132A1E] hover:bg-white/50 transition-colors"
            >
              Observatorio FET
              <ExternalLink className="h-3 w-3 text-[#C59B27]" />
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-[#506859]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1A3B2B]" />
            <span>NOA & NEA Hub v2.4</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(query ? `/buscar?q=${encodeURIComponent(query)}` : "/buscar");
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar noticias, series FET, cosechas..."
        className="pl-9 pr-10 bg-white border-border rounded-xl text-xs focus-visible:ring-[#C59B27]"
        aria-label="Buscar noticias"
      />
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-[#EDF6EF] px-1.5 py-0.5 rounded border border-border">
        ⌘K
      </span>
    </form>
  );
}

function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" />
        }
      >
        <Menu className="h-5 w-5 text-[#132A1E]" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background p-6">
        <SheetHeader className="mb-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          <SearchForm className="mb-3" />
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-bold text-[#132A1E] transition-colors hover:bg-[#EDF6EF]"
          >
            Portada
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#EDF6EF]"
            >
              {category.name}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          <a
            href={AGROTABACO_DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-[#132A1E] bg-[#EDF6EF] transition-colors hover:bg-[#E2EAE4]"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#C59B27]" />
              AgroTabaco Data
            </span>
            <span className="rounded-full bg-[#C59B27] px-2 py-0.5 text-[9px] font-extrabold text-[#151D19]">
              LIVE
            </span>
          </a>
          <Link
            href="/quienes-somos"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[#EDF6EF]"
          >
            Quiénes somos
          </Link>
          <Link
            href="/quienes-somos#contacto"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-lg bg-[#132A1E] px-3 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-[#1A3B2B]"
          >
            Contacto
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
