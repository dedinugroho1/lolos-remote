"use client";

import { Info, Sparkles } from "lucide-react";
import { BreakdownChart } from "@/components/score/breakdown-chart-lazy";
import { ScoreRing } from "@/components/score/score-ring-lazy";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { JobMatchResult } from "@/lib/schemas/job-match";
import { breakdownCategories, getScoreTier, scoreTierMeta } from "@/lib/score";
import { cn } from "@/lib/utils";

export function ScoreOverview({ result }: { result: JobMatchResult }) {
  const meta = scoreTierMeta[getScoreTier(result.fit_score)];
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-5 text-center">
          <ScoreRing score={result.fit_score} size={220} />
          <div className="space-y-1.5">
            <p className={cn("text-sm font-semibold", meta.text)}>{meta.description}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
          </div>
        </div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" aria-hidden />
          Hasil bersifat informatif — keputusan melamar sepenuhnya di tangan Anda.
        </p>
      </section>

      <section aria-labelledby="breakdown-title" className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 id="breakdown-title" className="text-base font-bold">
            Rincian 5 Kategori
          </h2>
          <span className="font-mono text-xs text-muted-foreground">total {result.fit_score}/100</span>
        </div>
        <div className="mt-4">
          <BreakdownChart breakdown={result.score_breakdown} />
        </div>
        <ul className="mt-4 grid gap-2 border-t pt-4 sm:grid-cols-2">
          {breakdownCategories.map((c) => (
            <li key={c.key} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                {c.label}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label={`Penjelasan ${c.label}`} className="rounded-full text-muted-foreground/70 hover:text-foreground">
                      <Info className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-56">{c.hint}</TooltipContent>
                </Tooltip>
              </span>
              <span className="font-mono font-semibold">
                {result.score_breakdown[c.key]}
                <span className="text-muted-foreground">/{c.max}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
