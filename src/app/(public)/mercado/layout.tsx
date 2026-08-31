import { MarketChatWidget } from "@/components/marketplace/market-chat-widget";

export default function MercadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MarketChatWidget />
    </>
  );
}
