import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  delta?: number | null;
  deltaText?: string;
  color?: "blue" | "emerald" | "purple" | "amber" | "cyan" | "indigo";
  icon?: string;
};

export function KpiCard({
  title,
  value,
  subtitle,
  delta,
  deltaText = "vs período anterior",
  color = "amber",
  icon,
}: KpiCardProps) {
  const hasDelta = delta !== null && delta !== undefined;
  const isPos = hasDelta && delta >= 0;

  return (
    <div className={cn("kpi-card", color)}>
      {icon && <span className="kpi-icon text-muted-foreground">{icon}</span>}
      <div className="kpi-label">{title}</div>
      <div className="kpi-value font-black">{value}</div>
      {hasDelta && (
        <div className="mt-2">
          <span className={isPos ? "kpi-delta-pos" : "kpi-delta-neg"}>
            {isPos ? "▲" : "▼"} {isPos ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="ml-1.5 text-[11px] text-[#506859]">{deltaText}</span>
        </div>
      )}
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
    </div>
  );
}
