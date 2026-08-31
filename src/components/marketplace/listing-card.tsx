import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { HS_CODES, LISTING_TYPE_LABELS } from "@/lib/marketplace/constants";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatQuantity(listing: Listing) {
  const value = new Intl.NumberFormat("es-AR").format(listing.quantity);
  return `${value} ${listing.unit === "ton" ? "tn" : "kg"}`;
}

function formatPrice(listing: Listing) {
  if (listing.price == null) return "Precio a consultar";
  const value = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: listing.currency,
    maximumFractionDigits: listing.currency === "USD" ? 2 : 0,
  }).format(listing.price);
  return listing.priceUnit === "por_kg" ? `${value} / kg` : value;
}

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  const hsLabel = listing.hsCode
    ? HS_CODES.find((entry) => entry.code === listing.hsCode)?.label
    : null;

  return (
    <Link
      href={`/mercado/${listing.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {listing.coverImage ? (
          <Image
            src={listing.coverImage}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin foto
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge
            className={cn(
              "border-transparent text-white",
              listing.listingType === "venta" ? "bg-brand-green-dark" : "bg-brand-olive"
            )}
          >
            {LISTING_TYPE_LABELS[listing.listingType]}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>{listing.variety}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{listing.province}</span>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-brand-green-dark">
          {listing.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {listing.tradingClass ? `Clase ${listing.tradingClass}` : hsLabel ?? "Procesado"} &middot;{" "}
          {formatQuantity(listing)}
        </p>
        <p className="mt-auto pt-2 text-base font-semibold text-brand-green-dark">
          {formatPrice(listing)}
        </p>
      </div>
    </Link>
  );
}
