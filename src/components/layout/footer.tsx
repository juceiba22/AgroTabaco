import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { AGROTABACO_DATA_URL } from "@/lib/config";
import type { Category } from "@/lib/types";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-20 bg-[#0D1F15] text-white border-t border-[#1A3B2B]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1 flex flex-col gap-4">
          <Logo variant="light" subtext="PORTAL EDITORIAL & DATA HUB" />
          <p className="text-xs leading-relaxed text-white/70">
            Periodismo de investigación, análisis sectorial e inteligencia cuantitativa del tabaco y las economías regionales argentinas.
          </p>
          <div className="flex gap-2.5 mt-2">
            <SocialIcon href="#" label="Facebook">
              <FacebookIcon className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="#" label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="#" label="Twitter / X">
              <XIcon className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Categorías
          </h3>
          <ul className="mt-4 space-y-2 text-xs">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="text-white/80 transition-colors hover:text-[#C59B27]"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Ecosistema & Datos
          </h3>
          <ul className="mt-4 space-y-2 text-xs">
            <li>
              <a
                href={`${AGROTABACO_DATA_URL}/laboratorio`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-[#C59B27]"
              >
                Laboratorio Estadístico
              </a>
            </li>
            <li>
              <a
                href={`${AGROTABACO_DATA_URL}/tabacostats`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-[#C59B27]"
              >
                TabacoStats Argentina
              </a>
            </li>
            <li>
              <a
                href={`${AGROTABACO_DATA_URL}/observatorio-fet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-[#C59B27]"
              >
                Observatorio FET
              </a>
            </li>
            <li>
              <a
                href={`${AGROTABACO_DATA_URL}/mercado-internacional`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 transition-colors hover:text-[#C59B27]"
              >
                Mercado Global & FOB
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Institucional
          </h3>
          <ul className="mt-4 space-y-2 text-xs text-white/80">
            <li>
              <Link href="/quienes-somos" className="transition-colors hover:text-[#C59B27]">
                Quiénes somos
              </Link>
            </li>
            <li>
              <Link href="/quienes-somos#contacto" className="transition-colors hover:text-[#C59B27]">
                Contacto & Redacción
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="transition-colors hover:text-[#C59B27]">
                Acceso Redacción
              </Link>
            </li>
            <li className="pt-2 text-white/60">
              Salta &amp; Jujuy, Argentina
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 bg-[#08140E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/50">
          <p>© {new Date().getFullYear()} AgroTabaco. Todos los derechos reservados.</p>
          <p className="font-mono text-[10px]">Agro-Financial Intelligence &amp; Editorial System</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-[#C59B27] hover:text-[#151D19]"
    >
      {children}
    </Link>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.35C16.19 4.31 15.15 4.22 13.94 4.22c-2.53 0-4.26 1.54-4.26 4.37V10.5H7v3h2.68V21h3.82Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4h4.4l4.1 5.6L17.1 4H20l-6.3 7.9L20.4 20H16l-4.4-6-5 6H3.6l6.7-8.3L4 4Z" />
    </svg>
  );
}
