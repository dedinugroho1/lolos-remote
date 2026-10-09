"use client";

/**
 * Hasil analisis sementara (transient) antara `/check` → `/check/result`.
 * Disimpan di sessionStorage (PRD Bab 6B) — tidak pernah ke database kecuali
 * pengguna menekan "Tandai Sudah Apply".
 */
import { useSyncExternalStore } from "react";
import type { JobMatchResult } from "@/lib/schemas/job-match";

const PENDING_KEY = "lolosremote_pending_match";

export type PendingMatch = {
  result: JobMatchResult;
  jobDescription: string;
  jobUrl: string | null;
  analyzedAt: string;
};

let pending: PendingMatch | null | undefined;
const listeners = new Set<() => void>();

function read(): PendingMatch | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingMatch) : null;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (pending === undefined) pending = read();
  return pending;
}

const emit = () => listeners.forEach((l) => l());

/** `undefined` selama SSR/hydration, `null` jika tidak ada hasil. */
export function usePendingMatch(): PendingMatch | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

export function setPendingMatch(match: PendingMatch) {
  pending = match;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(match));
  } catch {
    /* mode privat — tetap hidup di memori */
  }
  emit();
}

export function clearPendingMatch() {
  pending = null;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* abaikan */
  }
  emit();
}
