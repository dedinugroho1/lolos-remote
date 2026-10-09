import "server-only";
import { HttpError } from "@/lib/api/http";

/**
 * Rate limit harian per sesi (in-memory, fixed window 24 jam).
 * Cukup untuk satu instance; untuk multi-instance produksi bisa diganti Upstash (Fase 3).
 */
type Bucket = { count: number; resetAt: number };
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_KEYS = 10_000;

const store = new Map<string, Bucket>();

export const limits = {
  parseCv: Number(process.env.RATE_LIMIT_PARSE_PER_DAY ?? 20),
  checkMatch: Number(process.env.RATE_LIMIT_MATCH_PER_DAY ?? 100),
  auditContract: Number(process.env.RATE_LIMIT_AUDIT_PER_DAY ?? 20),
};

const limitMessages: Record<keyof typeof limits, string> = {
  parseCv: `Batas ${limits.parseCv} kali unggah CV per hari tercapai. Silakan coba lagi besok.`,
  checkMatch: `Batas ${limits.checkMatch} kali cek lowongan per hari tercapai. Silakan coba lagi besok.`,
  auditContract: `Batas ${limits.auditContract} kali audit kontrak per hari tercapai. Silakan coba lagi besok.`,
};

export function consumeRateLimit(scope: keyof typeof limits, sessionId: string) {
  const now = Date.now();
  const key = `${scope}:${sessionId}`;
  let bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + DAY_MS };
    if (store.size >= MAX_KEYS) {
      // Buang entri kedaluwarsa / tertua agar memori tetap terkendali (LRU sederhana).
      for (const [k, v] of store) {
        if (v.resetAt <= now || store.size >= MAX_KEYS) store.delete(k);
        if (store.size < MAX_KEYS * 0.9) break;
      }
    }
  }
  if (bucket.count >= limits[scope]) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    throw new HttpError(429, "rate_limited", limitMessages[scope], retryAfter);
  }
  bucket.count += 1;
  store.delete(key);
  store.set(key, bucket);
}
