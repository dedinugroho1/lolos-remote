"use client";

import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/score/animated-number";
import { findingStatusMeta, findingStatusOrder, safetyMeta } from "@/lib/contract/meta";
import type { FindingStatus } from "@/lib/schemas/contract-audit";
import { scoreColor } from "@/lib/score";
import { cn } from "@/lib/utils";

const SIZE = 180;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const tierIcon = { high: ShieldCheck, medium: ShieldQuestion, low: ShieldAlert };

export function SafetyScoreCard({ score, counts }: { score: number; counts: Record<FindingStatus, number> }) {
  const meta = safetyMeta(score);
  const Icon = tierIcon[meta.tier];
  const color = scoreColor(score);
  // Mulai dari 0 lalu animasikan ke skor (transisi stroke-dashoffset).
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <section aria-labelledby="safety-score-title" className={cn("flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm", meta.border)}>
      <h2 id="safety-score-title" className="text-sm font-semibold text-muted-foreground">
        Skor Keamanan Dokumen
      </h2>

      <div
        role="img"
        aria-label={`Skor keamanan ${score} dari 100 — ${meta.label}`}
        className="relative mx-auto mt-4 grid place-items-center"
        style={{ width: SIZE, height: SIZE }}
      >
        <div aria-hidden className="absolute inset-[14%] rounded-full opacity-30 blur-2xl" style={{ background: color }} />
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative -rotate-90" aria-hidden>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--muted)" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5 font-mono font-bold">
            <AnimatedNumber value={score} className="text-5xl" />
            <span className="text-base text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold", meta.soft, meta.text, meta.border)}>
          <Icon className="size-4" aria-hidden />
          {meta.label}
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">{meta.description}</p>

      <dl className="mt-auto grid grid-cols-3 gap-2 pt-6">
        {findingStatusOrder.map((status) => {
          const s = findingStatusMeta[status];
          return (
            <div key={status} className={cn("rounded-xl border px-2 py-2.5 text-center", s.soft, s.border)}>
              <dt className="text-[11px] font-semibold text-muted-foreground">
                <span aria-hidden>{s.emoji}</span> {s.short}
              </dt>
              <dd className={cn("font-mono text-xl font-bold", s.text)}>{counts[status]}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
