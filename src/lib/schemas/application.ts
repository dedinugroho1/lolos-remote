import { z } from "zod";
import type { CvProfile } from "./cv-profile";
import { jobMatchSchema, type JobMatchResult } from "./job-match";

// Enum status lamaran (sama dengan applicationStatusEnum di src/db/schema.ts — Fase 2)
export const applicationStatusEnum = ["applied", "interview", "offer", "rejected", "ghosted"] as const;
export type ApplicationStatus = (typeof applicationStatusEnum)[number];

export const NOTES_MAX = 2000;

export const jobDescriptionSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(50, "Job Description minimal 50 karakter")
    .transform((v) => v.slice(0, 15_000)),
  jobUrl: z.union([z.literal(""), z.url("Link lowongan tidak valid")]).optional(),
});

export const saveApplicationSchema = z.object({
  jobTitle: z.string().trim().min(1, "Judul lowongan wajib diisi").max(200),
  companyName: z.string().trim().min(1, "Nama perusahaan wajib diisi").max(200),
  notes: z.string().max(NOTES_MAX, `Catatan maksimal ${NOTES_MAX} karakter`).optional(),
});

export const updateApplicationSchema = z
  .object({
    status: z.enum(applicationStatusEnum, { error: "Status lamaran tidak valid" }).optional(),
    notes: z.string().max(NOTES_MAX, `Catatan maksimal ${NOTES_MAX} karakter`).nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, "Tidak ada perubahan yang dikirim");

/** Payload `POST /api/check-match`. */
export const checkMatchRequestSchema = z.object({
  jobDescription: z.string().max(100_000, "Job Description terlalu panjang"),
});

/** Payload `POST /api/save-application`: hasil cek (snapshot) + konfirmasi user. */
export const saveApplicationRequestSchema = saveApplicationSchema.extend({
  result: jobMatchSchema,
  jobDescription: z.string().max(15_000),
  jobUrl: z.union([z.literal(""), z.url()]).nullable().optional(),
});

export const applicationIdSchema = z.uuid("ID lamaran tidak valid");

/** Snapshot yang disimpan di kolom `match_result_json`. */
export type MatchSnapshot = JobMatchResult & {
  job_description?: string;
  job_url?: string | null;
};

/**
 * Bentuk data lamaran di sisi client — mengikuti `SavedApplicationRow`
 * (Bab 10) dengan tanggal berupa ISO string agar aman diserialisasi.
 */
export type Application = {
  id: string;
  jobTitle: string;
  companyName: string;
  fitScore: number;
  locationRequirement: string | null;
  timezoneOverlap: string | null;
  contractType: string | null;
  salaryRange: string | null;
  matchResultJson: MatchSnapshot;
  matchedSkills: string[];
  gaps: string[];
  mandatoryWarnings: string[];
  status: ApplicationStatus;
  notes: string | null;
  appliedAt: string;
  updatedAt: string;
};

/** Profil CV tersimpan — mengikuti `CvProfileRow` (Bab 10). */
export type StoredCvProfile = {
  id: string;
  profileJson: CvProfile;
  originalFileName: string | null;
  claudeModel: string;
  createdAt: string;
  updatedAt: string;
};
