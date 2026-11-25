import {
  PARTICIPACION_SALTA_FET,
  POR_PRODUCTOR_ANUAL,
  POR_PRODUCTOR_MENSUAL,
  PRECIO_FET_POR_PRODUCTOR_ANUAL,
  PRECIO_FET_POR_PRODUCTOR_MENSUAL,
  PRECIO_FET_SALTA_2026,
  PRODUCTORES_ESTIMADOS,
  RESOLUCIONES,
  TIPOS_DE_DESTINO,
  TOTAL,
  fmtMillones,
  fmtPct,
} from "@/lib/informes/poa-salta-2026";

// Primera hoja del informe: en pantalla es una tarjeta; al imprimir ocupa
// una página A4 completa y el informe detallado empieza en la siguiente.
export function ResumenEjecutivo() {
  return (
    <section
      aria-labelledby="resumen-ejecutivo"
      className="mb-10 overflow-hidden rounded-2xl border border-border bg-card shadow-xs print:mb-0 print:break-after-page print:rounded-none print:border-0 print:shadow-none"
    >
      <div className="h-1.5 bg-gradient-to-r from-brand-green-dark via-brand-green-light to-brand-gold" />
      <div className="p-6 sm:p-9 print:px-1 print:pt-3 print:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-brand-olive">
          <span>AgroTabaco · Estudios</span>
          <span className="font-mono text-muted-foreground">25/11/2026</span>
        </div>
        <h2
          id="resumen-ejecutivo"
          className="mt-3 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl print:mt-1 print:text-2xl"
        >
          Resumen ejecutivo
        </h2>
        <p className="mt-1 text-sm font-medium text-brand-olive">
          Planes Operativos Anuales (POA) del Fondo Especial del Tabaco · Provincia de Salta · 2026
        </p>

        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90 print:mt-4 print:space-y-2.5 print:text-[11.5px]">
          <p>
            <strong className="text-brand-green-dark">Objeto del estudio.</strong> AgroTabaco
            estudió los Planes Operativos Anuales que la Secretaría de Agricultura, Ganadería y
            Pesca aprobó para la Provincia de Salta durante 2026. El detalle por entidad y por
            resolución está en las páginas siguientes.
          </p>
          <p>
            <strong className="text-brand-green-dark">Monto transferido.</strong> Hasta la fecha,
            las {RESOLUCIONES.length} resoluciones aprobadas suman{" "}
            <strong>$ 126.388 millones</strong>, que se transfirieron a la Cámara del Tabaco de
            Salta. Este monto no incluye el “precio FET”, que se paga directamente a los
            productores.
          </p>
          <div>
            <p>
              <strong className="text-brand-green-dark">Distribución por tipo de destino.</strong>{" "}
              Clasificamos los fondos según el destino que fija cada resolución:
            </p>
            <table className="mt-3 w-full text-sm print:text-[11.5px]">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-brand-olive print:text-[9.5px]">
                  <th className="py-1.5 pr-3 text-left font-bold">Tipo de destino</th>
                  <th className="py-1.5 pr-3 text-left font-bold">Entidad (estimada)</th>
                  <th className="py-1.5 pr-3 text-right font-bold">Monto</th>
                  <th className="w-16 py-1.5 text-right font-bold">%</th>
                </tr>
              </thead>
              <tbody>
                {TIPOS_DE_DESTINO.map((t) => (
                  <tr key={t.tipo} className="border-b border-border align-top">
                    <td className="py-1.5 pr-3 print:py-0.5">
                      <span className="font-medium text-foreground">{t.tipo}</span>
                      <span className="block text-xs text-muted-foreground print:text-[10px]">
                        {t.detalle}
                      </span>
                    </td>
                    <td className="py-1.5 print:py-0.5 pr-3 text-muted-foreground">{t.entidades.join(" · ")}</td>
                    <td className="py-1.5 print:py-0.5 pr-3 text-right tabular-nums whitespace-nowrap">
                      {fmtMillones(t.monto)}
                    </td>
                    <td className="py-1.5 print:py-0.5 text-right tabular-nums text-muted-foreground">
                      {fmtPct(t.pct, 1)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold text-brand-green-dark">
                  <td className="py-1.5 print:py-0.5 pr-3" colSpan={2}>
                    Total
                  </td>
                  <td className="py-1.5 print:py-0.5 pr-3 text-right tabular-nums">{fmtMillones(TOTAL)}</td>
                  <td className="py-1.5 print:py-0.5 text-right tabular-nums">100 %</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 rounded-lg border border-brand-gold/40 bg-[#F7F1E2] px-4 py-2.5 text-[13px] leading-snug text-[#4a3a14] print:text-[11px]">
              <strong>La entidad receptora es una estimación, no una afirmación.</strong>{" "}
              Suponemos que lo destinado a insumos y fertilizantes termina en Fertinorte; lo de
              seguridad social (aportes, ART y seguros), en SUMICLI; la cobertura de salud, en
              AMPTS; y el apoyo a la producción y la emergencia climática, en COPROTAB.
            </p>
          </div>

          <div className="rounded-xl bg-brand-green-dark p-5 text-white print:px-4 print:py-3">
            <p className="text-sm leading-snug text-emerald-100/90 print:text-[11.5px]">
              <strong className="text-white">Monto por productor</strong> (unos{" "}
              {PRODUCTORES_ESTIMADOS.toLocaleString("es-AR")} productores). Los fondos POA no
              incluyen el precio FET, que se suma aparte.
            </p>
            <table className="mt-3 w-full text-sm print:mt-2 print:text-[11.5px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-white/60 print:text-[9.5px]">
                  <th className="pb-1 text-left font-semibold" />
                  <th className="pb-1 pl-4 text-right font-semibold">Por productor / año</th>
                  <th className="pb-1 pl-4 text-right font-semibold">Por productor / mes</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <MontoFila
                  color="text-brand-gold"
                  label="Fondos POA a instituciones"
                  anual={POR_PRODUCTOR_ANUAL}
                  mensual={POR_PRODUCTOR_MENSUAL}
                />
                <MontoFila
                  color="text-[#8fd3a8]"
                  label="Precio FET, pago directo (estimado)"
                  anual={PRECIO_FET_POR_PRODUCTOR_ANUAL}
                  mensual={PRECIO_FET_POR_PRODUCTOR_MENSUAL}
                />
                <tr className="border-t border-white/20 font-bold">
                  <td className="pt-1.5">Total por productor</td>
                  <td className="pt-1.5 pl-4 text-right">
                    {fmtMillones(POR_PRODUCTOR_ANUAL + PRECIO_FET_POR_PRODUCTOR_ANUAL)}
                  </td>
                  <td className="pt-1.5 pl-4 text-right">
                    {fmtMillones(POR_PRODUCTOR_MENSUAL + PRECIO_FET_POR_PRODUCTOR_MENSUAL)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p>
              <strong className="text-brand-green-dark">Preguntas.</strong> Frente a los
              conflictos por la distribución del FET, desde AgroTabaco planteamos dos preguntas:
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-6 marker:font-bold marker:text-brand-gold">
              <li>
                ¿Los productores reciben efectivamente, en promedio, esos $ 5 a 6 millones por mes,
                ya sea en forma directa o a través de los servicios de estas entidades?
              </li>
              <li>
                ¿Qué utilidad tiene un subsidio de esta magnitud, si en otros países productores la
                actividad tabacalera no recibe subsidios de este tipo y es rentable?
              </li>
            </ol>
          </div>

          <p className="text-xs italic text-muted-foreground print:text-[10.5px]">
            Las cifras son estimaciones hechas con resoluciones públicas de la SAGyP. La cantidad
            de productores es una estimación de AgroTabaco. El precio FET de Salta (
            {fmtMillones(PRECIO_FET_SALTA_2026)}) se estima aplicando la participación de Salta en
            el valor FET de la campaña 2024/25 ({fmtPct(PARTICIPACION_SALTA_FET * 100, 1)}) a lo
            pagado a nivel nacional en 2026 según la ejecución mensual del FET (abril a agosto).
          </p>
        </div>

        <div className="mt-8 flex justify-end print:mt-2">
          <div className="min-w-[240px] border-t-2 border-brand-gold pt-2 text-right">
            <p className="font-serif text-lg font-bold text-brand-green-dark">
              Equipo Técnico de AgroTabaco
            </p>
            <p className="text-sm text-muted-foreground">Salta, 25 de noviembre de 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MontoFila({
  color,
  label,
  anual,
  mensual,
}: {
  color: string;
  label: string;
  anual: number;
  mensual: number;
}) {
  return (
    <tr>
      <td className="py-0.5 text-emerald-100/90">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-sm bg-current ${color}`} />
          {label}
        </span>
      </td>
      <td className={`py-0.5 pl-4 text-right font-serif text-xl font-bold print:text-base ${color}`}>
        {fmtMillones(anual)}
      </td>
      <td className={`py-0.5 pl-4 text-right font-serif text-xl font-bold print:text-base ${color}`}>
        {fmtMillones(mensual)}
      </td>
    </tr>
  );
}
