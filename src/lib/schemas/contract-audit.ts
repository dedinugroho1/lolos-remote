import { z } from "zod";

/** Batas ukuran PDF kontrak (dipakai client & server). */
export const MAX_CONTRACT_BYTES = 10 * 1024 * 1024;

export const findingStatusEnum = ["red_flag", "warning", "safe"] as const;
export type FindingStatus = (typeof findingStatusEnum)[number];

export const contractFindingSchema = z.object({
  status: z.enum(findingStatusEnum),
  title: z.string().max(160),
  clause_reference: z.string().max(120),
  excerpt: z.string().max(600),
  analysis: z.string().max(1200),
  recommendation: z.string().max(800),
});
export type ContractFinding = z.infer<typeof contractFindingSchema>;

/**
 * Output terstruktur Claude untuk `POST /api/audit-kontrak`. Skema yang sama
 * dikirim ke API sebagai JSON schema (structured outputs) lalu divalidasi ulang.
 */
export const contractAuditSchema = z.object({
  is_employment_contract: z.boolean(),
  contract_title: z.string().max(200),
  safety_score: z.number().int().min(0).max(100),
  executive_summary: z.string().max(2000),
  contract_profile: z.object({
    contract_type: z.string().max(200),
    employer: z.string().max(200),
    role: z.string().max(200),
    compensation: z.string().max(300),
    working_hours: z.string().max(300),
    governing_law: z.string().max(200),
  }),
  findings: z.array(contractFindingSchema).max(40),
  negotiation_draft: z.object({
    subject: z.string().max(200),
    body: z.string().max(5000),
  }),
});
export type ContractAudit = z.infer<typeof contractAuditSchema>;

/** Payload `POST /api/contract-audits` (bookmark hasil audit). */
export const saveContractAuditRequestSchema = z.object({
  contractName: z.string().trim().min(1, "Nama kontrak wajib diisi").max(200),
  audit: contractAuditSchema,
});

export const contractAuditIdSchema = z.uuid("ID audit tidak valid");

/** Ringkasan audit tersimpan untuk daftar riwayat (tanpa snapshot penuh). */
export type ContractAuditSummary = {
  id: string;
  contractName: string;
  safetyScore: number;
  redFlagsCount: number;
  createdAt: string;
};

export type StoredContractAudit = ContractAuditSummary & { audit: ContractAudit };

const statusOrder: Record<FindingStatus, number> = { red_flag: 0, warning: 1, safe: 2 };

export function countFindings(findings: ContractFinding[]): Record<FindingStatus, number> {
  const counts: Record<FindingStatus, number> = { red_flag: 0, warning: 0, safe: 0 };
  for (const f of findings) counts[f.status] += 1;
  return counts;
}

/** Urutkan temuan (red flag → warning → safe) dan pastikan skor di rentang 0-100. */
export function normalizeAudit(audit: ContractAudit): ContractAudit {
  return {
    ...audit,
    safety_score: Math.min(100, Math.max(0, Math.round(audit.safety_score))),
    findings: [...audit.findings].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]),
  };
}
