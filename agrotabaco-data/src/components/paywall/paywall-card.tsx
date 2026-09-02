import Link from "next/link";

export function PaywallCard({ benefit }: { benefit: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-amber-600/40 bg-white/70 p-4">
      <div className="max-w-xs rounded-xl border border-amber-600 bg-white p-5 text-center shadow-lg">
        <span className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-amber-50 text-lg">
          🔒
        </span>
        <p className="font-serif text-base font-bold text-brand-green-dark">Contenido exclusivo AgroTabaco Data</p>
        <p className="mt-1.5 text-sm text-muted-foreground">{benefit}</p>
        <Link
          href="/planes"
          className="mt-3 inline-block rounded-md bg-brand-green-dark px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-darker"
        >
          Ver planes
        </Link>
      </div>
    </div>
  );
}
