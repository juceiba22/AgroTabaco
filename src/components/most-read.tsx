import Link from "next/link";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MostRead({ posts }: { posts: Post[] }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <h2 className="mb-4 font-serif text-lg font-bold text-brand-green-dark">
        Más leídas
      </h2>
      <ol className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <li key={post.id} className="flex gap-3">
            <span className="font-serif text-2xl font-bold leading-none text-brand-olive-light">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <Link
                href={`/post/${post.slug}`}
                className="text-sm font-semibold leading-snug text-foreground transition-colors hover:text-brand-green-dark"
              >
                {post.title}
              </Link>
              <time dateTime={post.publishedAt} className="text-xs text-muted-foreground">
                {formatDate(post.publishedAt)}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
