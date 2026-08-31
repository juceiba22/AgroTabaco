"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Menu, Search, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { STATS_DASHBOARD_URL } from "@/lib/config";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />
          <Logo />
        </div>

        <SearchForm className="hidden flex-1 max-w-sm md:flex" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Buscar"
            nativeButton={false}
            render={<Link href="/buscar" />}
          >
            <Search className="size-5" />
          </Button>
          <Button
            nativeButton={false}
            render={<Link href="/quienes-somos#contacto" />}
            className="bg-brand-green-dark text-white hover:bg-brand-green-darker"
          >
            Contacto
          </Button>
        </div>
      </div>

      <nav className="hidden border-t bg-brand-green-dark text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="whitespace-nowrap px-3 py-2.5 text-sm font-medium tracking-wide text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              {category.name}
            </Link>
          ))}
          <span className="mx-1 h-4 w-px shrink-0 bg-white/20" aria-hidden="true" />
          <a
            href={STATS_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium tracking-wide text-brand-olive-light transition-colors hover:bg-white/10 hover:text-white"
          >
            <BarChart3 className="size-4" />
            Estadísticas
          </a>
        </div>
      </nav>
    </header>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-brand-green-dark",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-dark text-white">
        <Sprout className="size-5" />
      </span>
      <span>
        Agro<span className="text-brand-olive">Tabaco</span>
      </span>
    </Link>
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
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar noticias..."
        className="pl-9"
        aria-label="Buscar noticias"
      />
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
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          <SearchForm className="mb-3" />
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {category.name}
            </Link>
          ))}
          <a
            href={STATS_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-brand-green-dark transition-colors hover:bg-muted"
          >
            <BarChart3 className="size-4" />
            Estadísticas
          </a>
          <Link
            href="/quienes-somos"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Quiénes somos
          </Link>
          <Link
            href="/quienes-somos#contacto"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-brand-green-dark px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green-darker"
          >
            Contacto
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
