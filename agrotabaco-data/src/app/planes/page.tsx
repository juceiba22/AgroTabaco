export const metadata = {
  title: "Planes | AgroTabaco Data",
};

export default function PlanesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="executive-header">
        <h1>Planes de AgroTabaco Data</h1>
        <p>Los 4 paneles del ecosistema, con el nivel de detalle que necesites.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista gratuita</p>
          <p className="mt-1 font-serif text-2xl font-bold text-brand-green-dark">Cuenta con Google</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>– Las 4 secciones visibles de entrada, ninguna pestaña oculta</li>
            <li>– Datos del período o campaña más reciente</li>
            <li>– Gráficos interactivos, sin exportar</li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-amber-600 bg-card p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Suscripción anual</p>
          <p className="mt-1 font-serif text-2xl font-bold text-brand-green-dark">AgroTabaco Data</p>
          <p className="mt-1 text-3xl font-extrabold text-foreground">$99.990 <span className="text-base font-medium text-muted-foreground">/ año</span></p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>✓ Historial completo de cada dataset</li>
            <li>✓ Exportación a CSV en los cuatro paneles</li>
            <li>✓ Comparativos multi-campaña y multi-país</li>
            <li>✓ Buscador y consulta de registros del Observatorio del FET</li>
          </ul>
          <p className="mt-5 rounded-md bg-brand-gray px-3 py-2 text-center text-sm font-medium text-muted-foreground">
            Disponible en breve
          </p>
        </div>
      </div>
    </div>
  );
}
