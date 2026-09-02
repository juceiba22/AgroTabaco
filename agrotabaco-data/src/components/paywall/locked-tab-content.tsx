import { PaywallCard } from "@/components/paywall/paywall-card";

/**
 * Reemplaza el módulo real dentro de un <TabsContent> bloqueado. El
 * recorte de seguridad ya pasó en el page.tsx del panel (el array que
 * llegó al cliente ni siquiera tiene los datos de esta pestaña) — esto es
 * sólo la segunda capa: evita mostrar un gráfico vacío/roto y explica por
 * qué no hay nada que ver acá.
 */
export function LockedTabContent({ title, benefit }: { title: string; benefit: string }) {
  return (
    <>
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-green-dark">{title}</h3>
      </div>
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 blur-[2px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #e3e6dc 0 2px, transparent 2px 24px), repeating-linear-gradient(0deg, #e3e6dc 0 1px, transparent 1px 40px)",
          }}
        />
        <PaywallCard benefit={benefit} />
      </div>
    </>
  );
}
