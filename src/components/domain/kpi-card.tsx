import { cn } from "@/lib/cn";

export function KpiCard({
  title,
  value,
  subtitle,
  variant = "default",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "warning" | "danger" | "success";
}) {
  const borderColors = {
    default: "border-border",
    warning: "border-[var(--color-warning)]",
    danger: "border-[var(--color-danger)]",
    success: "border-[var(--color-success)]",
  };

  return (
    <div className={cn("card-glass", borderColors[variant])}>
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
