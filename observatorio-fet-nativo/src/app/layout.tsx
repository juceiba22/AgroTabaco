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
  title: "Observatorio del FET | AgroTabaco",
  description:
    "Observatorio público de los Planes Operativos Anuales (POAs) financiados con el Fondo Especial del Tabaco (Ley Nº 19.800) a favor de las provincias tabacaleras.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-gray text-foreground">{children}</body>
    </html>
  );
}
