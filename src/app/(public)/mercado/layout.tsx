import { notFound } from "next/navigation";
import { MarketChatWidget } from "@/components/marketplace/market-chat-widget";
import { MERCADO_ENABLED } from "@/lib/config";

export default function MercadoLayout({ children }: { children: React.ReactNode }) {
  if (!MERCADO_ENABLED) notFound();

  return (
    <>
      {children}
      <MarketChatWidget />
    </>
  );
}
