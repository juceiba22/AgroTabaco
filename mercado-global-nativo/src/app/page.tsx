import { DashboardShell } from "@/components/dashboard-shell";
import { getTobaccoProduction } from "@/lib/data";
import type { TobaccoProduction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let data: TobaccoProduction[] = [];

  try {
    data = await getTobaccoProduction();
  } catch (error) {
    console.error("Error cargando datos de producción de tabaco:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <DashboardShell data={data} />
    </div>
  );
}
