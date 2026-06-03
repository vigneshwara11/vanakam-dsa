import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "amber" | "emerald" | "violet" | "rose";
};

const accentStyles = {
  amber: {
    border: "border-amber-500/30",
    glow: "shadow-[0_0_24px_-8px_rgba(245,158,11,0.35)]",
    icon: "text-amber-400",
    value: "text-amber-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_24px_-8px_rgba(16,185,129,0.35)]",
    icon: "text-emerald-400",
    value: "text-emerald-300",
  },
  violet: {
    border: "border-violet-500/30",
    glow: "shadow-[0_0_24px_-8px_rgba(139,92,246,0.35)]",
    icon: "text-violet-400",
    value: "text-violet-300",
  },
  rose: {
    border: "border-rose-500/30",
    glow: "shadow-[0_0_24px_-8px_rgba(244,63,94,0.35)]",
    icon: "text-rose-400",
    value: "text-rose-300",
  },
};

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accent = "amber",
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-zinc-900/80 p-5 backdrop-blur-sm ${styles.border} ${styles.glow}`}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {label}
          </p>
          <p
            className={`mt-2 font-mono text-3xl font-bold tabular-nums ${styles.value}`}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80 ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
