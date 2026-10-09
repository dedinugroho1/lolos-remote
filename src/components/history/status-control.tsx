"use client";

import { Check, Ghost, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applicationStatusEnum, type ApplicationStatus } from "@/lib/schemas/application";
import { statusFlow, statusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusControl({ status, onChange }: { status: ApplicationStatus; onChange: (s: ApplicationStatus) => void }) {
  const terminal = status === "rejected" || status === "ghosted";
  const currentIdx = statusFlow.indexOf(status);

  return (
    <div className="space-y-5">
      <ol className="flex items-center" aria-label="Progres lamaran">
        {statusFlow.map((s, i) => {
          const done = !terminal && i <= currentIdx;
          const active = !terminal && i === currentIdx;
          return (
            <li key={s} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => onChange(s)}
                aria-label={`Ubah status ke ${statusMeta[s].label}`}
                aria-current={active ? "step" : undefined}
                className="group flex flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-full border-2 font-mono text-xs font-bold transition-all group-hover:scale-110",
                    done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                    active && "ring-4 ring-primary/20",
                  )}
                >
                  {done && !active ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-xs font-semibold", done ? "text-foreground" : "text-muted-foreground")}>
                  {statusMeta[s].label}
                </span>
              </button>
              {i < statusFlow.length - 1 && (
                <span className={cn("mx-2 mb-6 h-0.5 flex-1 rounded-full", !terminal && i < currentIdx ? "bg-primary" : "bg-border")} aria-hidden />
              )}
            </li>
          );
        })}
      </ol>

      {terminal && (
        <p
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
            status === "rejected" ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground",
          )}
        >
          {status === "rejected" ? <XCircle className="size-4" aria-hidden /> : <Ghost className="size-4" aria-hidden />}
          {status === "rejected" ? "Lamaran ini ditolak. Tetap semangat — catat pelajarannya di notes." : "Belum ada kabar dari perusahaan (ghosted)."}
        </p>
      )}

      <Select value={status} onValueChange={(v) => onChange(v as ApplicationStatus)}>
        <SelectTrigger aria-label="Ubah status lamaran" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {applicationStatusEnum.map((s) => (
            <SelectItem key={s} value={s}>
              <span className={cn("size-2 rounded-full", statusMeta[s].dot)} aria-hidden />
              {statusMeta[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
