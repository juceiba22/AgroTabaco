import type { Metadata } from "next";
import { Inter, Source_Serif_4, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AgroTabaco | Noticias del agro y las economías regionales",
    template: "%s | AgroTabaco",
  },
  description:
    "Portal de noticias agropecuarias: actualidad del agro, ganadería, tabaco, mercados y economías regionales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
