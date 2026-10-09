import { getScoreTier, scoreTierMeta, type ScoreTier } from "@/lib/score";
import type { FindingStatus } from "@/lib/schemas/contract-audit";

const safetyLabels: Record<ScoreTier, { label: string; description: string }> = {
  high: {
    label: "Aman",
    description: "Mayoritas klausul wajar. Tetap baca detail temuan sebelum tanda tangan.",
  },
  medium: {
    label: "Perlu Perhatian",
    description: "Ada klausul yang sebaiknya diklarifikasi atau dinegosiasikan terlebih dahulu.",
  },
  low: {
    label: "Berisiko Tinggi",
    description: "Terdapat klausul yang berpotensi merugikan Anda secara signifikan.",
  },
};

/** Skala warna sama dengan Fit Score (75+ hijau, 50-74 kuning, <50 merah), label khusus kontrak. */
export function safetyMeta(score: number) {
  const tier = getScoreTier(score);
  const { text, bg, soft, border } = scoreTierMeta[tier];
  return { tier, text, bg, soft, border, ...safetyLabels[tier] };
}

export const findingStatusMeta: Record<
  FindingStatus,
  { emoji: string; label: string; short: string; description: string; text: string; bg: string; soft: string; border: string }
> = {
  red_flag: {
    emoji: "🔴",
    label: "Klausul Berisiko Tinggi",
    short: "Red Flag",
    description: "Berpotensi merugikan Anda — prioritaskan untuk dinegosiasikan.",
    text: "text-danger",
    bg: "bg-danger",
    soft: "bg-danger/[0.06]",
    border: "border-danger/30",
  },
  warning: {
    emoji: "🟡",
    label: "Perlu Klarifikasi",
    short: "Warning",
    description: "Ambigu atau memberatkan — tanyakan sebelum tanda tangan.",
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-warning",
    soft: "bg-warning/[0.08]",
    border: "border-warning/35",
  },
  safe: {
    emoji: "🟢",
    label: "Klausul Standar",
    short: "Safe",
    description: "Ketentuan yang wajar dan umum dalam kontrak kerja remote.",
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-success",
    soft: "bg-success/[0.06]",
    border: "border-success/30",
  },
};

export const findingStatusOrder: FindingStatus[] = ["red_flag", "warning", "safe"];
