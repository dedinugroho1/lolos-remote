// src/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enum status lamaran
export const applicationStatusEnum = ['applied', 'interview', 'offer', 'rejected', 'ghosted'] as const;
export type ApplicationStatus = (typeof applicationStatusEnum)[number];

// Tabel: cv_profiles — 1 CV aktif per device/session
export const cvProfiles = pgTable(
  'cv_profiles',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userSessionId: text('user_session_id').notNull(),
    profileJson: jsonb('profile_json').notNull(), // menampung CvProfileSchema
    originalFileName: text('original_file_name'),
    claudeModel: text('claude_model').notNull().default('claude-haiku-5-5'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionUniq: uniqueIndex('cv_profiles_session_uniq').on(table.userSessionId),
  }),
);

// Tabel: saved_applications — hanya lowongan yang ditandai apply
export const savedApplications = pgTable(
  'saved_applications',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userSessionId: text('user_session_id').notNull(),
    jobTitle: text('job_title').notNull(),
    companyName: text('company_name').notNull(),
    fitScore: integer('fit_score').notNull(),
    locationRequirement: text('location_requirement'),
    timezoneOverlap: text('timezone_overlap'),
    contractType: text('contract_type'),
    salaryRange: text('salary_range'),
    matchResultJson: jsonb('match_result_json').notNull(), // snapshot hasil analisis
    matchedSkills: jsonb('matched_skills').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    gaps: jsonb('gaps').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    mandatoryWarnings: jsonb('mandatory_warnings').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    status: text('status').$type<ApplicationStatus>().notNull().default('applied'),
    notes: text('notes'),
    appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('saved_applications_session_idx').on(table.userSessionId),
    appliedAtIdx: index('saved_applications_applied_at_idx').on(table.appliedAt),
  }),
);

// Tabel: contract_audits — riwayat audit kontrak yang di-bookmark user (fitur Audit Kontrak)
export const contractAudits = pgTable(
  'contract_audits',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userSessionId: text('user_session_id').notNull(),
    contractName: text('contract_name').notNull(),
    safetyScore: integer('safety_score').notNull(),
    redFlagsCount: integer('red_flags_count').notNull().default(0),
    auditSummaryJson: jsonb('audit_summary_json').notNull(), // snapshot ContractAudit
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('contract_audits_session_idx').on(table.userSessionId),
    createdAtIdx: index('contract_audits_created_at_idx').on(table.createdAt),
  }),
);

export type CvProfileRow = typeof cvProfiles.$inferSelect;
export type SavedApplicationRow = typeof savedApplications.$inferSelect;
export type NewSavedApplication = typeof savedApplications.$inferInsert;
export type ContractAuditRow = typeof contractAudits.$inferSelect;
export type NewContractAudit = typeof contractAudits.$inferInsert;
