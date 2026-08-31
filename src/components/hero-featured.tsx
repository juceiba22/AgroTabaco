import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function HeroFeatured({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-xl bg-brand-green-darker">
      <Link href={`/post/${post.slug}`} className="block">
        {/* Foto: alto fijo por aspect-ratio, solo la imagen se recorta acá. */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-green-darker to-transparent" />
        </div>
        {/* Texto: siempre sobre el panel sólido (nunca sobre la foto), en
            flujo normal para que crezca con el contenido sin recortarse. */}
        <div className="flex flex-col gap-3 px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="flex items-center gap-3">
            <CategoryBadge category={post.category} asLink={false} />
            <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
              Destacada
            </span>
          </div>
          <h1 className="text-balance font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:max-w-3xl lg:text-4xl">
            {post.title}
          </h1>
          <p className="text-balance text-sm text-white/85 sm:text-base lg:max-w-2xl">
            {post.excerpt}
          </p>
          <time dateTime={post.publishedAt} className="text-xs font-medium uppercase tracking-wide text-white/70">
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </Link>
    </article>
  );
}
