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
        "rounded-full border-0 bg-[#EDF6EF] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#132A1E] shadow-none hover:bg-[#E2EAE4]",
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
