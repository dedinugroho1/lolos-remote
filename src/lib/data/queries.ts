import "server-only";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contractAudits, cvProfiles, savedApplications, type NewSavedApplication } from "@/db/schema";
import { toApplication, toStoredCvProfile } from "@/lib/data/mappers";
import type { ApplicationStatus } from "@/lib/schemas/application";
import type { CvProfile } from "@/lib/schemas/cv-profile";

/*
 * Semua query WAJIB difilter `user_session_id` (PRD Bab 6D) — tidak ada fungsi
 * di file ini yang membaca/menulis data tanpa sessionId.
 */

export async function getCvProfile(sessionId: string) {
  const [row] = await getDb().select().from(cvProfiles).where(eq(cvProfiles.userSessionId, sessionId)).limit(1);
  return row ? toStoredCvProfile(row) : null;
}

/** UPSERT: hanya 1 CV aktif per sesi. */
export async function upsertCvProfile(sessionId: string, profile: CvProfile, originalFileName: string, claudeModel: string) {
  const now = new Date();
  const [row] = await getDb()
    .insert(cvProfiles)
    .values({ userSessionId: sessionId, profileJson: profile, originalFileName, claudeModel })
    .onConflictDoUpdate({
      target: cvProfiles.userSessionId,
      set: { profileJson: profile, originalFileName, claudeModel, updatedAt: now },
    })
    .returning();
  return toStoredCvProfile(row);
}

export async function listApplications(sessionId: string) {
  const rows = await getDb()
    .select()
    .from(savedApplications)
    .where(eq(savedApplications.userSessionId, sessionId))
    .orderBy(desc(savedApplications.appliedAt));
  return rows.map(toApplication);
}

export async function countApplications(sessionId: string) {
  const [row] = await getDb()
    .select({ value: count() })
    .from(savedApplications)
    .where(eq(savedApplications.userSessionId, sessionId));
  return row?.value ?? 0;
}

export async function getApplication(sessionId: string, id: string) {
  const [row] = await getDb()
    .select()
    .from(savedApplications)
    .where(and(eq(savedApplications.id, id), eq(savedApplications.userSessionId, sessionId)))
    .limit(1);
  return row ? toApplication(row) : null;
}

export async function insertApplication(values: Omit<NewSavedApplication, "id" | "appliedAt" | "updatedAt" | "status">) {
  const [row] = await getDb().insert(savedApplications).values({ ...values, status: "applied" }).returning();
  return toApplication(row);
}

export async function updateApplication(
  sessionId: string,
  id: string,
  patch: { status?: ApplicationStatus; notes?: string | null },
) {
  const [row] = await getDb()
    .update(savedApplications)
    .set({ ...patch, updatedAt: sql`now()` })
    .where(and(eq(savedApplications.id, id), eq(savedApplications.userSessionId, sessionId)))
    .returning();
  return row ? toApplication(row) : null;
}

export async function deleteApplication(sessionId: string, id: string) {
  const rows = await getDb()
    .delete(savedApplications)
    .where(and(eq(savedApplications.id, id), eq(savedApplications.userSessionId, sessionId)))
    .returning({ id: savedApplications.id });
  return rows.length > 0;
}

/** Hapus profil + seluruh lamaran + riwayat audit kontrak milik sesi dalam satu batch (atomik di Neon HTTP). */
export async function deleteAllSessionData(sessionId: string) {
  const db = getDb();
  const [apps, profiles, audits] = await db.batch([
    db.delete(savedApplications).where(eq(savedApplications.userSessionId, sessionId)).returning({ id: savedApplications.id }),
    db.delete(cvProfiles).where(eq(cvProfiles.userSessionId, sessionId)).returning({ id: cvProfiles.id }),
    db.delete(contractAudits).where(eq(contractAudits.userSessionId, sessionId)).returning({ id: contractAudits.id }),
  ]);
  return { applications: apps.length, profiles: profiles.length, contractAudits: audits.length };
}
