import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercado Internacional de Tabaco | AgroTabaco",
  description:
    "Visualización analítica interactiva de producción y dinámicas globales del mercado tabacalero (FAOstat / Our World in Data, 1961-2024).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-gray text-foreground">{children}</body>
    </html>
  );
}
