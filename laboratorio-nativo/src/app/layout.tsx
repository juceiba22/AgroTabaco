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
  title: "Laboratorio Estadístico | AgroTabaco",
  description:
    "Volumen, precios, participación de mercado y consumo aparente histórico del mercado interno de tabaco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-gray text-foreground">{children}</body>
    </html>
  );
}
