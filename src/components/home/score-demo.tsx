"use client";

import { useState } from "react";
import { ScoreRing } from "@/components/score/score-ring-lazy";
import { Slider } from "@/components/ui/slider";
import { breakdownCategories, getScoreTier, scoreColor, scoreTierMeta } from "@/lib/score";
import { cn } from "@/lib/utils";

const presets = [
  { label: "UI Engineer · US Only", score: 41 },
  { label: "React Developer · APAC", score: 62 },
  { label: "Senior Frontend · Worldwide", score: 78 },
  { label: "Fullstack · Fintech", score: 85 },
];

/** Membagi skor total ke 5 kategori secara proporsional (untuk demo). */
function distribute(score: number) {
  const raw = breakdownCategories.map((c) => (c.max * score) / 100);
  const floored = raw.map(Math.floor);
  let rest = score - floored.reduce((a, b) => a + b, 0);
  const order = raw.map((v, i) => ({ i, frac: v - Math.floor(v) })).sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (rest <= 0) break;
    floored[i] += 1;
    rest -= 1;
  }
  return floored;
}

export function ScoreDemo() {
  const [score, setScore] = useState(78);
  const tier = getScoreTier(score);
  const meta = scoreTierMeta[tier];
  const parts = distribute(score);

  return (
    <div className="grid items-center gap-10 rounded-3xl border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-4">
        <ScoreRing score={score} size={240} animateNumber={false} />
        <p className="max-w-60 text-center text-sm text-muted-foreground">{meta.description}</p>
      </div>

      <div className="space-y-7">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="demo-slider" className="text-sm font-semibold">
              Geser untuk melihat perubahan warna skor
            </label>
            <span className={cn("font-mono text-sm font-bold", meta.text)}>{score}</span>
          </div>
          <Slider
            id="demo-slider"
            aria-label="Skor demo"
            className="mt-4"
            min={0}
            max={100}
            step={1}
            value={[score]}
            onValueChange={([v]) => setScore(v ?? 0)}
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span className="text-danger">0 · Kurang</span>
            <span className="text-warning">50 · Cukup</span>
            <span className="text-success">75 · Sangat cocok</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setScore(p.score)}
              aria-pressed={score === p.score}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm",
                score === p.score ? "border-primary bg-primary/10 text-primary" : "bg-background text-muted-foreground",
              )}
            >
              {p.label} · <span className="font-mono">{p.score}</span>
            </button>
          ))}
        </div>

        <ul className="space-y-3.5">
          {breakdownCategories.map((c, i) => {
            const pct = (parts[i] / c.max) * 100;
            return (
              <li key={c.key}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.label}</span>
                  <span className="font-mono font-semibold">
                    {parts[i]}
                    <span className="text-muted-foreground">/{c.max}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%`, background: scoreColor(pct) }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
