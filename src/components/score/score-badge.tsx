import { getScoreTier, scoreTierMeta } from "@/lib/score";
import { cn } from "@/lib/utils";

export function ScoreBadge({ score, size = "md", className }: { score: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const meta = scoreTierMeta[getScoreTier(score)];
  return (
    <span
      aria-label={`Fit score ${score} dari 100, ${meta.label}`}
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-mono font-bold tabular-nums",
        meta.soft,
        meta.text,
        meta.border,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        size === "lg" && "px-3.5 py-1.5 text-base",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.bg)} aria-hidden />
      {score}
    </span>
  );
}
