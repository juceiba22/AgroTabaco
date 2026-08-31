import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingFilters } from "@/components/marketplace/listing-filters";
import { ProductTypeNav } from "@/components/marketplace/product-type-nav";
import { getActiveListings } from "@/lib/marketplace/data";

export const metadata: Metadata = {
  title: "Tabaco procesado | Mercado Argentino de Tabaco",
  description:
    "Ofertas de compra y venta (exportación) de tabaco procesado Virginia y Burley por posición arancelaria HS.",
};

type PageProps = {
  searchParams: Promise<{ variety?: string; province?: string }>;
};

export default async function TabacoProcesadoPage({ searchParams }: PageProps) {
  const { variety, province } = await searchParams;
  const listings = await getActiveListings({ productType: "procesado", variety, province });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
            Mercado Argentino de Tabaco
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
            Tabaco procesado
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Ofertas de exportación por posición arancelaria HS-10 (Virginia y Burley, despalillado
            y trillado o en rama).
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
        <ProductTypeNav active="/mercado/tabaco-procesado" />
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
          Todavía no hay ofertas activas de tabaco procesado con estos filtros.
        </p>
      )}
    </div>
  );
}
