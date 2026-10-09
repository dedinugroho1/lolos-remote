import type { ScoreBreakdown } from "@/lib/schemas/job-match";

export type ScoreTier = "high" | "medium" | "low";

/** Skala PRD: 75-100 tinggi (emerald), 50-74 sedang (amber), 0-49 rendah (rose). */
export function getScoreTier(score: number): ScoreTier {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export const scoreTierMeta: Record<
  ScoreTier,
  { label: string; description: string; text: string; bg: string; soft: string; border: string; ring: string }
> = {
  high: {
    label: "Sangat Cocok",
    description: "Profil Anda selaras dengan sebagian besar syarat lowongan.",
    text: "text-success",
    bg: "bg-success",
    soft: "bg-success/10",
    border: "border-success/30",
    ring: "ring-success/30",
  },
  medium: {
    label: "Cukup Cocok",
    description: "Ada beberapa celah yang layak Anda pertimbangkan.",
    text: "text-warning",
    bg: "bg-warning",
    soft: "bg-warning/10",
    border: "border-warning/30",
    ring: "ring-warning/30",
  },
  low: {
    label: "Kurang Cocok",
    description: "Banyak syarat utama yang belum terlihat di CV Anda.",
    text: "text-danger",
    bg: "bg-danger",
    soft: "bg-danger/10",
    border: "border-danger/30",
    ring: "ring-danger/30",
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Warna gradasi otomatis dari skor: Rose (0) → Amber (50) → Emerald (100).
 * Dipakai untuk score ring agar transisi warnanya halus, bukan loncat.
 */
export function scoreColor(score: number): string {
  const s = Math.max(0, Math.min(100, score));
  if (s <= 50) {
    const t = s / 50;
    const hue = (lerp(346, 398, t) + 360) % 360;
    return `hsl(${hue.toFixed(1)} ${lerp(77, 92, t).toFixed(1)}% 50%)`;
  }
  const t = (s - 50) / 50;
  return `hsl(${lerp(38, 160, t).toFixed(1)} ${lerp(92, 84, t).toFixed(1)}% ${lerp(50, 39, t).toFixed(1)}%)`;
}

export type BreakdownKey = keyof ScoreBreakdown;

export const breakdownCategories: { key: BreakdownKey; label: string; short: string; max: number; hint: string }[] = [
  {
    key: "technical_skills",
    label: "Skill Teknis Wajib",
    short: "Skill Wajib",
    max: 40,
    hint: "Seberapa banyak skill wajib di lowongan yang tercantum di CV Anda.",
  },
  {
    key: "experience_seniority",
    label: "Pengalaman & Senioritas",
    short: "Pengalaman",
    max: 20,
    hint: "Kesesuaian lama pengalaman dan level senioritas yang diminta.",
  },
  {
    key: "domain_project",
    label: "Domain Proyek",
    short: "Domain",
    max: 15,
    hint: "Kedekatan industri/produk yang pernah Anda kerjakan.",
  },
  {
    key: "nice_to_have",
    label: "Nice-to-have Skill",
    short: "Nice-to-have",
    max: 15,
    hint: "Skill tambahan yang memberi nilai plus, bukan syarat utama.",
  },
  {
    key: "language_communication",
    label: "Bahasa & Komunikasi",
    short: "Bahasa",
    max: 10,
    hint: "Kemampuan bahasa dan gaya komunikasi kerja remote.",
  },
];

export function sumBreakdown(b: ScoreBreakdown): number {
  return Math.round(
    b.technical_skills + b.experience_seniority + b.domain_project + b.nice_to_have + b.language_communication,
  );
}
