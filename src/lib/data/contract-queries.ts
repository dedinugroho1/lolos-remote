import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contractAudits, type ContractAuditRow, type NewContractAudit } from "@/db/schema";
import type { ContractAudit, ContractAuditSummary, StoredContractAudit } from "@/lib/schemas/contract-audit";

/*
 * Semua query WAJIB difilter `user_session_id` — sama seperti `queries.ts`.
 */

const summaryColumns = {
  id: contractAudits.id,
  contractName: contractAudits.contractName,
  safetyScore: contractAudits.safetyScore,
  redFlagsCount: contractAudits.redFlagsCount,
  createdAt: contractAudits.createdAt,
};

function toSummary(row: Pick<ContractAuditRow, keyof typeof summaryColumns>): ContractAuditSummary {
  return {
    id: row.id,
    contractName: row.contractName,
    safetyScore: row.safetyScore,
    redFlagsCount: row.redFlagsCount,
    createdAt: row.createdAt.toISOString(),
  };
}

function toStored(row: ContractAuditRow): StoredContractAudit {
  return { ...toSummary(row), audit: row.auditSummaryJson as ContractAudit };
}

/** Daftar ringkas (tanpa snapshot JSON) agar payload halaman tetap kecil. */
export async function listContractAudits(sessionId: string, limit = 50) {
  const rows = await getDb()
    .select(summaryColumns)
    .from(contractAudits)
    .where(eq(contractAudits.userSessionId, sessionId))
    .orderBy(desc(contractAudits.createdAt))
    .limit(limit);
  return rows.map(toSummary);
}

export async function countContractAudits(sessionId: string) {
  const [row] = await getDb()
    .select({ value: count() })
    .from(contractAudits)
    .where(eq(contractAudits.userSessionId, sessionId));
  return row?.value ?? 0;
}

export async function getContractAudit(sessionId: string, id: string) {
  const [row] = await getDb()
    .select()
    .from(contractAudits)
    .where(and(eq(contractAudits.id, id), eq(contractAudits.userSessionId, sessionId)))
    .limit(1);
  return row ? toStored(row) : null;
}

export async function insertContractAudit(values: Omit<NewContractAudit, "id" | "createdAt">) {
  const [row] = await getDb().insert(contractAudits).values(values).returning(summaryColumns);
  return toSummary(row);
}

export async function deleteContractAudit(sessionId: string, id: string) {
  const rows = await getDb()
    .delete(contractAudits)
    .where(and(eq(contractAudits.id, id), eq(contractAudits.userSessionId, sessionId)))
    .returning({ id: contractAudits.id });
  return rows.length > 0;
}
