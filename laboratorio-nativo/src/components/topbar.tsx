import { FlaskConical } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function Topbar() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
      <a
        href={SITE_URL}
        className="agrotabaco-topbar-brand inline-flex items-center gap-2 text-xl font-bold text-brand-green-dark"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-green-dark text-white">
          <FlaskConical className="size-4" />
        </span>
        Laboratorio <span className="text-brand-olive">Estadístico</span>
      </a>
      <a href={SITE_URL} className="text-sm font-semibold text-muted-foreground hover:text-brand-green-dark">
        ← Volver al portal de noticias
      </a>
    </div>
  );
}
