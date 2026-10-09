"use client";

import dynamic from "next/dynamic";
import type { ScoreRingProps } from "./score-ring";

/** Recharts di-lazy-load (ssr: false) agar bundle awal tetap ringan. */
export const ScoreRing = dynamic<ScoreRingProps>(() => import("./score-ring"), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[220px] animate-pulse rounded-full bg-muted" />,
});
