import { cn } from "@/lib/utils";

export function AdBanner({
  label = "Espacio publicitario",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[250px] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-brand-olive/40 bg-brand-gray text-center",
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Publicidad
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
