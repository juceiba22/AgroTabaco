import type { Metadata } from "next";
import { VirginiaPortfolio, type Lang } from "./portfolio";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const TITLE = "Export Portfolio — Premium Virginia, Salta, Argentina";
const DESCRIPTION =
  "Flue-cured Virginia, crop 2026, grade B1F, lot 20/03/2026. Specifications and sample requests for importers, embassies and consulates.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exportacion/virginia" },
  openGraph: {
    type: "website",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    url: "/exportacion/virginia",
    siteName: "AgroTabaco",
    images: [
      { url: "/images/exportacion/virginia-og.jpg", width: 1200, height: 630, alt: "Premium Virginia tobacco sample, Salta, Argentina" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    images: ["/images/exportacion/virginia-og.jpg"],
  },
};

export default async function VirginiaPortfolioPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  // Los destinatarios son compradores del exterior: inglés por defecto,
  // español con ?lang=es.
  const initialLang: Lang = lang === "es" ? "es" : "en";
  return <VirginiaPortfolio initialLang={initialLang} />;
}
