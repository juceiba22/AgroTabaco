import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function NewsCard({
  post,
  className,
  priority = false,
}: {
  post: Post;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-white shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#C59B27]/40",
        className
      )}
    >
      <Link
        href={`/post/${post.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-muted"
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 z-10 backdrop-blur-md bg-[#132A1E]/80 rounded-full px-1.5 py-0.5">
          <CategoryBadge category={post.category} asLink={false} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3 text-[#C59B27]" /> 4 min
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug text-[#151D19] group-hover:text-[#132A1E] transition-colors">
            <Link href={`/post/${post.slug}`} className="hover:underline decoration-[#C59B27]">
              {post.title}
            </Link>
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-[#4E4635]">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground font-medium truncate max-w-[180px]">
            {post.author || "AgroTabaco Redacción"}
          </span>
          <Link
            href={`/post/${post.slug}`}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#132A1E] group-hover:text-[#C59B27] group-hover:translate-x-1 transition-all"
            aria-label={`Leer más sobre ${post.title}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
