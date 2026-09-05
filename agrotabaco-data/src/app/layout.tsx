import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { TopNav } from "@/components/nav/topnav";
import { getEntitlement } from "@/lib/entitlements";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fontSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AgroTabaco Data | Terminal Cuantitativo e Inteligencia Sectorial",
  description:
    "La capa de inteligencia cuantitativa de AgroTabaco: Laboratorio Estadístico, TabacoStats Argentina, Mercado Internacional y Observatorio FET.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, plan } = await getEntitlement();

  return (
    <html lang="es" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F3FCF5] text-foreground font-sans">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
          <TopNav user={user} plan={plan} />
          {children}
          <footer className="mt-12 border-t border-border/80 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>AgroTabaco Data &copy; {new Date().getFullYear()} | Terminal Analítica e Inteligencia Sectorial</span>
            <span className="font-mono text-[10px]">Datos Oficiales AFIP / FET / MAGyP</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
