import { DashboardShell } from "@/components/dashboard-shell";
import { Topbar } from "@/components/topbar";
import { getPoasTabaco } from "@/lib/data";
import type { PoaTabaco } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let data: PoaTabaco[] = [];

  try {
    data = await getPoasTabaco();
  } catch (error) {
    console.error("[observatorio-fet-nativo] Error cargando datos de Supabase:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Topbar />
      <DashboardShell data={data} />
      <footer className="mt-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
        Observatorio del FET &copy; 2026 | Un desarrollo de AgroTabaco | Transparencia sobre los Planes Operativos Anuales del Fondo
        Especial del Tabaco (Ley Nº 19.800)
      </footer>
    </div>
  );
}
