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
  title: "TabacoStats Argentina | AgroTabaco",
  description:
    "Plataforma integral de inteligencia y analítica del sector tabacalero nacional: precios, calidad, empresas y producción primaria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-gray text-foreground">{children}</body>
    </html>
  );
}
