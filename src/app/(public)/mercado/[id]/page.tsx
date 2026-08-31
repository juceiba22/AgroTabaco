import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExpressInterestForm } from "@/components/marketplace/express-interest-form";
import { HS_CODES, LISTING_TYPE_LABELS } from "@/lib/marketplace/constants";
import { getListingById, getMyInterestForListing } from "@/lib/marketplace/data";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return {};
  return { title: `${listing.title} | Mercado Argentino de Tabaco` };
}

function formatQuantity(quantity: number, unit: string) {
  const value = new Intl.NumberFormat("es-AR").format(quantity);
  return `${value} ${unit === "ton" ? "toneladas" : "kg"}`;
}

function formatPrice(price: number | null, currency: string, priceUnit: string | null) {
  if (price == null) return "Precio a consultar";
  const value = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(price);
  return priceUnit === "por_kg" ? `${value} / kg` : value;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === listing.sellerId;
  const myInterest = !isOwner && user ? await getMyInterestForListing(id) : undefined;
  const hsEntry = listing.hsCode ? HS_CODES.find((entry) => entry.code === listing.hsCode) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {listing.coverImage ? (
              <Image
                src={listing.coverImage}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Sin foto
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Badge
              className={
                listing.listingType === "venta"
                  ? "border-transparent bg-brand-green-dark text-white"
                  : "border-transparent bg-brand-olive text-white"
              }
            >
              {LISTING_TYPE_LABELS[listing.listingType]}
            </Badge>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Publicado el {formatDate(listing.createdAt)}
            </span>
          </div>

          <h1 className="mt-2 font-serif text-3xl font-bold text-brand-green-dark">
            {listing.title}
          </h1>

          <p className="mt-4 whitespace-pre-line text-foreground">{listing.description}</p>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-2xl font-semibold text-brand-green-dark">
              {formatPrice(listing.price, listing.currency, listing.priceUnit)}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Variedad</dt>
                <dd className="font-medium text-foreground">{listing.variety}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Provincia</dt>
                <dd className="font-medium text-foreground">{listing.province}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Cantidad</dt>
                <dd className="font-medium text-foreground">
                  {formatQuantity(listing.quantity, listing.unit)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  {listing.productType === "verde" ? "Clase comercial" : "Posición arancelaria"}
                </dt>
                <dd className="font-medium text-foreground">
                  {listing.tradingClass ?? (hsEntry ? `${hsEntry.code} (${hsEntry.label})` : "—")}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t pt-6">
              {isOwner ? (
                <p className="text-sm text-muted-foreground">
                  Esta es tu publicación.{" "}
                  <Link href="/mercado/mis-ofertas" className="font-medium text-brand-green-dark hover:underline">
                    Ver interés recibido
                  </Link>
                  .
                </p>
              ) : !user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Iniciá sesión para contactar al vendedor.
                  </p>
                  <Link
                    href={`/mercado/login?redirectTo=/mercado/${listing.id}`}
                    className="w-fit rounded-md bg-brand-green-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-darker"
                  >
                    Ingresar
                  </Link>
                </div>
              ) : myInterest ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Ya le avisaste al vendedor que estás interesado.
                  </p>
                  {listing.seller?.phone && (
                    <p className="flex items-center gap-2 text-sm text-foreground">
                      <Phone className="size-4 text-brand-green-dark" />
                      {listing.seller.phone}
                    </p>
                  )}
                  {(listing.seller?.fullName || listing.seller?.companyName) && (
                    <p className="text-sm text-muted-foreground">
                      {[listing.seller.fullName, listing.seller.companyName]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
              ) : (
                <ExpressInterestForm listingId={listing.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
