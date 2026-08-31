import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/mercado", label: "Todas las ofertas" },
  { href: "/mercado/tabaco-verde", label: "Tabaco verde" },
  { href: "/mercado/tabaco-procesado", label: "Tabaco procesado" },
] as const;

export function ProductTypeNav({ active }: { active: string }) {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-muted p-1">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.href
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
