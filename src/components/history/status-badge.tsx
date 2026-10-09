import type { ApplicationStatus } from "@/lib/schemas/application";
import { statusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}
