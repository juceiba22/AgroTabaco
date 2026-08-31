import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conocé el equipo y la misión de AgroTabaco, el portal de noticias del agro y las economías regionales.",
};

export default function QuienesSomosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-olive">
        Institucional
      </span>
      <h1 className="mt-1 font-serif text-3xl font-bold text-brand-green-dark sm:text-4xl">
        Quiénes somos
      </h1>

      <div className="prose prose-neutral mt-6 max-w-none font-serif leading-relaxed">
        <p>
          AgroTabaco es un portal de noticias dedicado a informar sobre la
          actualidad del agro, la ganadería, el tabaco, los mercados y las
          economías regionales. Nacimos con el objetivo de acercar a
          productores, técnicos y público general información clara,
          actualizada y confiable sobre el sector agropecuario.
        </p>
        <p>
          Nuestro equipo de redacción trabaja junto a especialistas y fuentes
          del sector para cubrir cada campaña, cada anuncio de política
          agropecuaria y cada novedad tecnológica que impacta en la
          producción regional.
        </p>
        <h2>Nuestra misión</h2>
        <p>
          Democratizar el acceso a la información agropecuaria, poniendo en
          valor el trabajo de los productores y acompañando el desarrollo de
          las economías regionales de todo el país.
        </p>
      </div>

      <div id="contacto" className="mt-14 scroll-mt-24 rounded-xl border bg-brand-gray p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-brand-green-dark">
          Contacto
        </h2>
        <p className="mt-2 text-muted-foreground">
          ¿Tenés una novedad para compartir o querés anunciar con nosotros?
          Escribinos.
        </p>
        <ul className="mt-5 flex flex-col gap-3 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="size-4 text-brand-green-dark" />
            redaccion@agrotabaco.com.ar
          </li>
          <li className="flex items-center gap-3">
            <Phone className="size-4 text-brand-green-dark" />
            +54 387 400-0000
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="size-4 text-brand-green-dark" />
            Salta, Argentina
          </li>
        </ul>
      </div>
    </div>
  );
}
