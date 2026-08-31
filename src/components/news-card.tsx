import Image from "next/image";
import Link from "next/link";
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
        "group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link href={`/post/${post.slug}`} className="relative block aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge category={post.category} asLink={false} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <time
          dateTime={post.publishedAt}
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground">
          <Link href={`/post/${post.slug}`} className="transition-colors hover:text-brand-green-dark">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
