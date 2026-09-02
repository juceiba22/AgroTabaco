import { DashboardShell } from "@/components/dashboard-shell";
import { Topbar } from "@/components/topbar";
import {
  getAcopioClases,
  getAcopioEmpresas,
  getAcopioPrecios,
  getMercadoInternacional,
  getPrecioResoluciones,
  getProduccionPrimaria,
} from "@/lib/data";
import type {
  AcopioClase,
  AcopioEmpresa,
  AcopioPrecio,
  MercadoInternacional,
  PrecioResolucion,
  ProduccionPrimaria,
} from "@/lib/types";

// Los datos se leen frescos de Supabase en cada request — forzarlo evita
// que el build intente pre-renderizar esta ruta como estática.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let produccion: ProduccionPrimaria[] = [];
  let clases: AcopioClase[] = [];
  let empresas: AcopioEmpresa[] = [];
  let precios: AcopioPrecio[] = [];
  let precioFet: PrecioResolucion[] = [];
  let mercadoInternacional: MercadoInternacional[] = [];

  try {
    [produccion, clases, empresas, precios, precioFet, mercadoInternacional] = await Promise.all([
      getProduccionPrimaria(),
      getAcopioClases(),
      getAcopioEmpresas(),
      getAcopioPrecios(),
      getPrecioResoluciones(),
      getMercadoInternacional(),
    ]);
  } catch (error) {
    console.error("[tabacostats-nativo] Error cargando datos de Supabase:", error);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-6">
      <Topbar />
      <DashboardShell
        produccion={produccion}
        clases={clases}
        empresas={empresas}
        precios={precios}
        precioFet={precioFet}
        mercadoInternacional={mercadoInternacional}
      />
      <footer className="mt-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
        TabacoStats Argentina &copy; 2026 | Un desarrollo de AgroTabaco | Plataforma de Inteligencia del Sector
        Tabacalero Nacional — SAGyP &amp; FET
      </footer>
    </div>
  );
}
