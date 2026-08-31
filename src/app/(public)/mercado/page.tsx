import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingFilters } from "@/components/marketplace/listing-filters";
import { ProductTypeNav } from "@/components/marketplace/product-type-nav";
import { getActiveListings, getMarketplaceStats } from "@/lib/marketplace/data";
import type { ProductType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mercado Argentino de Tabaco",
  description:
    "Comprá y vendé tabaco verde por clase comercial y tabaco procesado para exportación, con los indicadores de precio de referencia de AgroTabaco.",
};

type PageProps = {
  searchParams: Promise<{ variety?: string; province?: string; tipo?: string }>;
};

export default async function MercadoPage({ searchParams }: PageProps) {
  const { variety, province, tipo } = await searchParams;
  const productType = tipo === "verde" || tipo === "procesado" ? (tipo as ProductType) : undefined;

  const [listings, stats] = await Promise.all([
    getActiveListings({ productType, variety, province }),
    getMarketplaceStats(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
            Mercado Argentino de Tabaco
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
            Comprá y vendé tabaco
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {stats.activeCount} {stats.activeCount === 1 ? "oferta activa" : "ofertas activas"} de
            tabaco verde por clase comercial y tabaco procesado para exportación.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/mercado/publicar" />}
          className="w-fit bg-brand-green-dark text-white hover:bg-brand-green-darker"
        >
          <Plus className="size-4" />
          Publicar oferta
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductTypeNav active="/mercado" />
        <ListingFilters />
      </div>

      {listings.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Todavía no hay ofertas activas con estos filtros.
        </p>
      )}
    </div>
  );
}
