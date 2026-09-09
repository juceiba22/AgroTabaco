import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  label?: string;
  imageSrc?: string;
  altText?: string;
  href?: string;
  className?: string;
}

export function AdBanner({
  label = "Espacio Publicitario",
  imageSrc = "/images/magnaza-ad.jpg",
  altText = "MAGNAZA Fertilizante Mineral Integral - Solución Total",
  href,
  className,
}: AdBannerProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-white p-2 shadow-xs transition-all hover:shadow-md hover:border-[#C59B27]/50">
      <div className="flex items-center justify-between px-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {href && (
          <span className="flex items-center gap-1 text-[#132A1E] opacity-70 group-hover:opacity-100 group-hover:text-[#C59B27] transition-all">
            <span>Anuncio</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </span>
        )}
      </div>

      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg bg-[#EDF6EF]">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={cn("block", className)}
      >
        {content}
      </a>
    );
  }

  return <div className={cn("block", className)}>{content}</div>;
}
