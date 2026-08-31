import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
  asLink = true,
}: {
  category: Category;
  className?: string;
  asLink?: boolean;
}) {
  const badge = (
    <Badge
      className={cn(
        "border-transparent bg-brand-olive text-white hover:bg-brand-olive/90",
        className
      )}
    >
      {category.name}
    </Badge>
  );

  if (!asLink) return badge;

  return (
    <Link href={`/categoria/${category.slug}`} className="inline-flex">
      {badge}
    </Link>
  );
}
