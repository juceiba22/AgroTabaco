import type { Metadata } from "next";
import { ExportPortfolio, type Lang } from "./portfolio";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const TITLE = "Export Portfolio — Argentine Tobacco";
const DESCRIPTION =
  "AgroTabaco export portfolio: Premium Burley from Tucumán and Premium Virginia from Salta, Argentina. Specifications and sample requests for importers, embassies and consulates.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/exportacion" },
  openGraph: {
    type: "website",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    url: "/exportacion",
    siteName: "AgroTabaco",
    images: [
      { url: "/images/exportacion/exportacion-og.jpg", width: 1200, height: 630, alt: "Burley and Virginia tobacco samples from Argentina" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
    images: ["/images/exportacion/exportacion-og.jpg"],
  },
};

export default async function ExportPortfolioPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  // Los destinatarios son compradores del exterior: inglés por defecto,
  // español con ?lang=es.
  const initialLang: Lang = lang === "es" ? "es" : "en";
  return <ExportPortfolio initialLang={initialLang} />;
}
