type ProgressBarProps = {
  label: string;
  valueLabel: string;
  percent: number;
  accent?: "amber" | "violet";
};

export function ProgressBar({
  label,
  valueLabel,
  percent,
  accent = "amber",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const fillClass =
    accent === "amber"
      ? "bg-gradient-to-r from-amber-600 to-amber-400"
      : "bg-gradient-to-r from-violet-600 to-violet-400";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-400">{label}</span>
        <span className="font-mono text-xs text-zinc-500">{valueLabel}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${fillClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
