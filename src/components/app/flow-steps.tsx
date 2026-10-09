import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Unggah CV", "Cek Lowongan", "Lihat Hasil"];

/** Indikator alur linear Upload → Cek → Hasil. */
export function FlowSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol aria-label="Langkah" className="flex items-center gap-2 text-xs font-semibold">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full border font-mono text-[11px]",
                done && "border-success bg-success text-success-foreground",
                active && "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30",
                !done && !active && "bg-card text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", active ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <span className={cn("h-px w-6 sm:w-10", done ? "bg-success" : "bg-border")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
