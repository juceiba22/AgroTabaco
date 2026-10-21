import type { Metadata } from "next";
import { BurleyPortfolio, type Lang } from "./portfolio";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const TITLE = "Export Portfolio — Premium Burley, Tucumán, Argentina";
const DESCRIPTION =
  "Threshed Burley, crop 2024, lot 25-BUR-002. Specifications and sample requests for importers, embassies and consulates.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exportacion/burley" },
  openGraph: {
    type: "website",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    url: "/exportacion/burley",
    siteName: "AgroTabaco",
    images: [
      { url: "/images/exportacion/burley-og.jpg", width: 1200, height: 630, alt: "Premium Burley tobacco, lot 25-BUR-002" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    images: ["/images/exportacion/burley-og.jpg"],
  },
};

export default async function BurleyPortfolioPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  // Los destinatarios son compradores del exterior: inglés por defecto,
  // español con ?lang=es.
  const initialLang: Lang = lang === "es" ? "es" : "en";
  return <BurleyPortfolio initialLang={initialLang} />;
}
