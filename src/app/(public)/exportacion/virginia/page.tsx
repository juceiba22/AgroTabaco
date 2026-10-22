import type { Metadata } from "next";
import { VirginiaPortfolio, type Lang } from "./portfolio";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const TITLE = "Export Portfolio — Virginia Flue-Cured Tobacco, Salta, Argentina";
const DESCRIPTION =
  "Product profile of Virginia flue-cured tobacco from Salta, Argentina, for importers, embassies and consulates. New-crop samples available on request.";

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
  },
  twitter: {
    card: "summary",
    title: `AgroTabaco ${TITLE}`,
    description: DESCRIPTION,
  },
};

export default async function VirginiaPortfolioPage({ searchParams }: PageProps) {
  const { lang } = await searchParams;
  // Los destinatarios son compradores del exterior: inglés por defecto,
  // español con ?lang=es.
  const initialLang: Lang = lang === "es" ? "es" : "en";
  return <VirginiaPortfolio initialLang={initialLang} />;
}
