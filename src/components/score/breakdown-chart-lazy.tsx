"use client";

import dynamic from "next/dynamic";
import type { BreakdownChartProps } from "./breakdown-chart";

export const BreakdownChart = dynamic<BreakdownChartProps>(() => import("./breakdown-chart"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 py-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-6 animate-pulse rounded-full bg-muted" />
      ))}
    </div>
  ),
});
