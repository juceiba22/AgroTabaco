import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { TopNav } from "@/components/nav/topnav";
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
  title: "AgroTabaco Data",
  description:
    "La capa de inteligencia de datos de AgroTabaco: Laboratorio Estadístico, TabacoStats Argentina, Mercado Internacional de Tabaco y Observatorio del FET, en un solo lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-brand-gray text-foreground">
        <div className="mx-auto max-w-[1440px] px-6 py-6">
          <TopNav />
          {children}
          <footer className="mt-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
            AgroTabaco Data &copy; 2026 | Un desarrollo de AgroTabaco | Inteligencia de datos del sector
            tabacalero argentino
          </footer>
        </div>
      </body>
    </html>
  );
}
