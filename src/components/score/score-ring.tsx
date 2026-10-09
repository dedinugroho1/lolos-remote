"use client";

import { useId } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { AnimatedNumber } from "@/components/score/animated-number";
import { getScoreTier, scoreColor, scoreTierMeta } from "@/lib/score";
import { cn } from "@/lib/utils";

export type ScoreRingProps = {
  score: number;
  size?: number;
  thickness?: number;
  showTier?: boolean;
  animateNumber?: boolean;
  className?: string;
};

/** Ring skor 0-100 (Recharts RadialBar) dengan warna gradasi merah → kuning → hijau. */
export default function ScoreRing({
  score,
  size = 220,
  thickness = 18,
  showTier = true,
  animateNumber = true,
  className,
}: ScoreRingProps) {
  const id = useId().replace(/:/g, "");
  const tier = getScoreTier(score);
  const meta = scoreTierMeta[tier];
  const color = scoreColor(score);
  const startColor = scoreColor(Math.max(0, score - 35));
  const outer = size / 2 - 4;
  const big = size >= 160;

  return (
    <div
      role="img"
      aria-label={`Skor kecocokan ${score} dari 100 — ${meta.label}`}
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full opacity-40 blur-2xl transition-colors duration-700"
        style={{ background: color }}
      />
      <RadialBarChart
        width={size}
        height={size}
        cx={size / 2}
        cy={size / 2}
        innerRadius={outer - thickness}
        outerRadius={outer}
        barSize={thickness}
        data={[{ name: "skor", value: score }]}
        startAngle={90}
        endAngle={-270}
        className="relative"
      >
        <defs>
          <linearGradient id={`ring-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={thickness / 2}
          fill={`url(#ring-${id})`}
          background={{ fill: "var(--muted)" }}
          isAnimationActive
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </RadialBarChart>
      <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="flex items-baseline gap-0.5 font-mono font-bold tracking-tight">
          {animateNumber ? (
            <AnimatedNumber value={score} className={big ? "text-5xl" : "text-2xl"} />
          ) : (
            <span className={big ? "text-5xl" : "text-2xl"}>{score}</span>
          )}
          <span className={cn("text-muted-foreground", big ? "text-lg" : "text-xs")}>/100</span>
        </div>
        {showTier && big && (
          <span
            className={cn("mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", meta.soft, meta.text)}
          >
            {meta.label}
          </span>
        )}
      </div>
    </div>
  );
}
