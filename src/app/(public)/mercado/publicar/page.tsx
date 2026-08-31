import type { Metadata } from "next";
import { ListingForm } from "@/components/marketplace/listing-form";

export const metadata: Metadata = {
  title: "Publicar oferta | Mercado Argentino de Tabaco",
};

export default function PublicarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 border-b pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
          Mercado Argentino de Tabaco
        </span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
          Publicar oferta
        </h1>
        <p className="mt-2 text-muted-foreground">
          Completá los datos de tu oferta de compra o venta. El contacto queda visible recién
          cuando alguien expresa interés.
        </p>
      </div>

      <ListingForm />
    </div>
  );
}
