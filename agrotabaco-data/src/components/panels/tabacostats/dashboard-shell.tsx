"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockedTabContent } from "@/components/paywall/locked-tab-content";
import { MERCADO_INTERNACIONAL_ENABLED } from "@/lib/panels/tabacostats/config";
import { ModuloCalidad } from "@/components/panels/tabacostats/modules/modulo-calidad";
import { ModuloEmpresas } from "@/components/panels/tabacostats/modules/modulo-empresas";
import { ModuloMercadoInternacional } from "@/components/panels/tabacostats/modules/modulo-mercado-internacional";
import { ModuloPrecioFet } from "@/components/panels/tabacostats/modules/modulo-precio-fet";
import { ModuloPrecios } from "@/components/panels/tabacostats/modules/modulo-precios";
import { ModuloProduccion } from "@/components/panels/tabacostats/modules/modulo-produccion";
import type { Plan } from "@/lib/entitlements";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/panels/tabacostats/types";

type Props = {
  produccion: ProduccionPrimaria[];
  clases: AcopioClase[];
  empresas: AcopioEmpresa[];
  precios: AcopioPrecio[];
  precioFet: PrecioResolucion[];
  mercadoInternacional: MercadoInternacional[];
  plan: Plan;
};

export function DashboardShell({
  produccion,
  clases,
  empresas,
  precios,
  precioFet,
  mercadoInternacional,
  plan,
}: Props) {
  const isPro = plan === "pro";
  const hasAnyData =
    produccion.length > 0 || clases.length > 0 || empresas.length > 0 || precios.length > 0 || precioFet.length > 0;

  if (!hasAnyData) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Todavía no hay datos cargados. Corré la migración y el seed de Supabase (
        <code>supabase/migrations/0007_fact_tabacostats.sql</code> y{" "}
        <code>supabase/seed_tabacostats.sql</code>) para ver el dashboard con datos reales.
      </div>
    );
  }

  return (
    <Tabs defaultValue="precios">
      <TabsList>
        <TabsTrigger value="precios">💰 Precios Acopio & Precio FET</TabsTrigger>
        <TabsTrigger value="calidad">🏷️ Calidad & Clases Comerciales</TabsTrigger>
        <TabsTrigger value="empresas">🏢 Acopio por Empresas</TabsTrigger>
        <TabsTrigger value="produccion">📊 Producción Primaria y Hectáreas</TabsTrigger>
        <TabsTrigger value="precio-fet">💵 Precio FET</TabsTrigger>
        {MERCADO_INTERNACIONAL_ENABLED && <TabsTrigger value="mercado-internacional">🌍 Mercado Internacional</TabsTrigger>}
      </TabsList>

      <TabsContent value="precios" className="mt-6 space-y-6">
        {isPro ? (
          <ModuloPrecios data={precios} />
        ) : (
          <LockedTabContent
            title="💰 Precios Acopio & Precio FET"
            benefit="Accedé a la serie completa de precios de acopio y complemento FET por campaña."
          />
        )}
      </TabsContent>
      <TabsContent value="calidad" className="mt-6 space-y-6">
        {isPro ? (
          <ModuloCalidad data={clases} />
        ) : (
          <LockedTabContent
            title="🏷️ Calidad & Clases Comerciales"
            benefit="Desbloqueá el detalle de producción por clase comercial y variedad."
          />
        )}
      </TabsContent>
      <TabsContent value="empresas" className="mt-6 space-y-6">
        {isPro ? (
          <ModuloEmpresas data={empresas} />
        ) : (
          <LockedTabContent
            title="🏢 Acopio por Empresas"
            benefit="Vé el ranking de empresas acopiadoras y su participación de mercado."
          />
        )}
      </TabsContent>
      <TabsContent value="produccion" className="mt-6 space-y-6">
        <ModuloProduccion data={produccion} />
      </TabsContent>
      <TabsContent value="precio-fet" className="mt-6 space-y-6">
        {isPro ? (
          <ModuloPrecioFet data={precioFet} />
        ) : (
          <LockedTabContent
            title="💵 Precio FET"
            benefit="Accedé al historial completo del complemento del Fondo Especial del Tabaco."
          />
        )}
      </TabsContent>
      {MERCADO_INTERNACIONAL_ENABLED && (
        <TabsContent value="mercado-internacional" className="mt-6 space-y-6">
          <ModuloMercadoInternacional data={mercadoInternacional} />
        </TabsContent>
      )}
    </Tabs>
  );
}
