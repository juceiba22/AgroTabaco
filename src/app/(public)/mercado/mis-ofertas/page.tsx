import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStatusSelect } from "@/components/marketplace/listing-status-select";
import { LISTING_TYPE_LABELS } from "@/lib/marketplace/constants";
import { getInterestsForListing, getMyListings } from "@/lib/marketplace/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mis ofertas | Mercado Argentino de Tabaco",
};

export default async function MisOfertasPage() {
  const listings = await getMyListings();
  const interestsByListing = await Promise.all(
    listings.map((listing) => getInterestsForListing(listing.id))
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
            Mercado Argentino de Tabaco
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
            Mis ofertas
          </h1>
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

      {listings.length === 0 ? (
        <p className="text-muted-foreground">Todavía no publicaste ninguna oferta.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {listings.map((listing, index) => {
            const interests = interestsByListing[index];
            return (
              <div key={listing.id} className="rounded-xl border bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {LISTING_TYPE_LABELS[listing.listingType]} · Publicada el{" "}
                      {formatDate(listing.createdAt)}
                    </p>
                    <Link
                      href={`/mercado/${listing.id}`}
                      className="font-serif text-lg font-bold text-brand-green-dark hover:underline"
                    >
                      {listing.title}
                    </Link>
                  </div>
                  <ListingStatusSelect listingId={listing.id} status={listing.status} />
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Interés recibido ({interests.length})
                  </p>
                  {interests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todavía nadie expresó interés.</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {interests.map((interest) => (
                        <li key={interest.id} className="rounded-lg bg-brand-gray p-3 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-foreground">
                              {[interest.buyer?.fullName, interest.buyer?.companyName]
                                .filter(Boolean)
                                .join(" · ") || "Comprador"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(interest.createdAt)}
                            </span>
                          </div>
                          {interest.buyer?.phone && (
                            <p className="mt-1 flex items-center gap-1.5 text-foreground">
                              <Phone className="size-3.5 text-brand-green-dark" />
                              {interest.buyer.phone}
                            </p>
                          )}
                          {interest.message && (
                            <p className="mt-1 text-muted-foreground">{interest.message}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
