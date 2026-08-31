import Link from "next/link";
import { Sprout } from "lucide-react";
import type { Category } from "@/lib/types";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-16 bg-brand-green-darker text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
              <Sprout className="size-5" />
            </span>
            Agro<span className="text-brand-olive-light">Tabaco</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Noticias y actualidad del agro, la ganadería, el tabaco y las
            economías regionales.
          </p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href="#" label="Facebook">
              <FacebookIcon className="size-4" />
            </SocialIcon>
            <SocialIcon href="#" label="Instagram">
              <InstagramIcon className="size-4" />
            </SocialIcon>
            <SocialIcon href="#" label="Twitter / X">
              <XIcon className="size-4" />
            </SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Categorías
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categoria/${category.slug}`}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Institucional
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/quienes-somos" className="text-white/80 transition-colors hover:text-white">
                Quiénes somos
              </Link>
            </li>
            <li>
              <Link href="/quienes-somos#contacto" className="text-white/80 transition-colors hover:text-white">
                Contacto
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-white/80 transition-colors hover:text-white">
                Acceso redacción
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>redaccion@agrotabaco.com.ar</li>
            <li>+54 387 400-0000</li>
            <li>Salta, Argentina</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-white/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} AgroTabaco. Todos los derechos reservados.
        </p>
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
      className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
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
