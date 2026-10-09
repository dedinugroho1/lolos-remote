"use client";

import { Lightbulb, Quote } from "lucide-react";
import { useState } from "react";
import { findingStatusMeta, findingStatusOrder } from "@/lib/contract/meta";
import type { ContractFinding, FindingStatus } from "@/lib/schemas/contract-audit";
import { cn } from "@/lib/utils";

type Filter = "all" | FindingStatus;

function FindingCard({ finding }: { finding: ContractFinding }) {
  const meta = findingStatusMeta[finding.status];
  return (
    <article className={cn("relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm", meta.border)}>
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", meta.bg)} />
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 font-bold leading-snug">{finding.title}</h4>
        {finding.clause_reference && (
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
            {finding.clause_reference}
          </span>
        )}
      </div>

      {finding.excerpt && (
        <blockquote className="mt-3 flex gap-2 rounded-xl bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground italic">
          <Quote className="mt-0.5 size-3.5 shrink-0 not-italic" aria-hidden />
          <span className="break-words">{finding.excerpt}</span>
        </blockquote>
      )}

      <p className="mt-3 text-sm leading-relaxed">{finding.analysis}</p>

      {finding.recommendation && (
        <div className={cn("mt-3 flex gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm", meta.soft, meta.border)}>
          <Lightbulb className={cn("mt-0.5 size-4 shrink-0", meta.text)} aria-hidden />
          <p>
            <span className="font-semibold">Usulan revisi: </span>
            {finding.recommendation}
          </p>
        </div>
      )}
    </article>
  );
}

export function FindingsSection({ findings, counts }: { findings: ContractFinding[]; counts: Record<FindingStatus, number> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const groups = findingStatusOrder.filter((s) => (filter === "all" || filter === s) && counts[s] > 0);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Semua", count: findings.length },
    ...findingStatusOrder.map((s) => ({ id: s, label: `${findingStatusMeta[s].emoji} ${findingStatusMeta[s].short}`, count: counts[s] })),
  ];

  return (
    <section aria-labelledby="findings-title" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="findings-title" className="text-xl font-bold">
            Temuan Klausul
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{findings.length} klausul dianalisis dan dipilah berdasarkan tingkat risiko.</p>
        </div>
        <div role="group" aria-label="Filter temuan" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === f.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {f.label}
              <span className={cn("font-mono", filter === f.id ? "opacity-80" : "opacity-60")}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 && (
        <p className="rounded-2xl border border-dashed bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Tidak ada temuan untuk kategori ini.
        </p>
      )}

      {groups.map((status) => {
        const meta = findingStatusMeta[status];
        return (
          <div key={status} className="space-y-3">
            <div className="flex items-baseline gap-2">
              <h3 className={cn("text-base font-bold", meta.text)}>
                <span aria-hidden>{meta.emoji}</span> {meta.label}{" "}
                <span className="font-mono text-sm text-muted-foreground">({counts[status]})</span>
              </h3>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">{meta.description}</p>
            <div className="grid gap-3 lg:grid-cols-2">
              {findings
                .filter((f) => f.status === status)
                .map((f, i) => (
                  <FindingCard key={`${status}-${i}`} finding={f} />
                ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
