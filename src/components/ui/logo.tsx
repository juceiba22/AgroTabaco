import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  subtext?: string;
  asLink?: boolean;
}

export function Logo({
  className,
  variant = "dark",
  subtext = "EDITORIAL & DATA HUB",
  asLink = true,
}: LogoProps) {
  const isLight = variant === "light";

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 leading-none", className)}>
      {/* Icono de hoja estilizada con línea de datos */}
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4C14 4 6 12 6 24C6 36 18 44 28 44C26 34 30 24 40 18C40 10 32 4 24 4Z"
          fill={isLight ? "#2F6844" : "#1A3B2B"}
        />
        <path
          d="M24 4C28 14 36 20 44 22C44 14 36 6 24 4Z"
          fill="#C59B27"
        />
        <circle cx="28" cy="24" r="3.5" fill="#FFFFFF" />
        <path
          d="M12 28L20 20L28 24L38 12"
          stroke="#C59B27"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif text-xl sm:text-2xl font-bold tracking-tight",
            isLight ? "text-white" : "text-[#132A1E]"
          )}
        >
          Agro<span className="text-[#C59B27]">Tabaco</span>
        </span>
        <span
          className={cn(
            "text-[9px] font-bold uppercase tracking-widest mt-0.5",
            isLight ? "text-white/70" : "text-[#506859]"
          )}
        >
          {subtext}
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
