import { CalendarDays, ChevronRight, FileSignature, MapPin, StickyNote } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/history/status-badge";
import { ScoreBadge } from "@/components/score/score-badge";
import { formatDate, formatRelative } from "@/lib/format";
import type { Application } from "@/lib/schemas/application";
import { scoreColor } from "@/lib/score";

export function ApplicationCard({ app }: { app: Application }) {
  return (
    <Link
      href={`/history/${app.id}`}
      aria-label={`Lihat detail lamaran ${app.jobTitle} di ${app.companyName}`}
      className="group card-lift relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm hover:border-primary/30"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: scoreColor(app.fitScore) }} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold transition-colors group-hover:text-primary">{app.jobTitle}</h3>
          <p className="truncate text-sm font-medium text-muted-foreground">{app.companyName}</p>
        </div>
        <ScoreBadge score={app.fitScore} />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <dt className="sr-only">Syarat lokasi</dt>
          <MapPin className="size-4 shrink-0" aria-hidden />
          <dd className="truncate">{app.locationRequirement ?? "Tidak disebutkan"}</dd>
        </div>
        {app.contractType && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <dt className="sr-only">Tipe kontrak</dt>
            <FileSignature className="size-4 shrink-0" aria-hidden />
            <dd className="truncate">{app.contractType}</dd>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <dt className="sr-only">Tanggal apply</dt>
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          <dd>
            {formatDate(app.appliedAt)} <span className="text-muted-foreground/70">· {formatRelative(app.appliedAt)}</span>
          </dd>
        </div>
      </dl>

      {app.notes && (
        <div className="mt-4 flex gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p className="line-clamp-2">{app.notes}</p>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-5">
        <StatusBadge status={app.status} />
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-muted-foreground transition-all group-hover:gap-1.5 group-hover:text-primary">
          Detail <ChevronRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
