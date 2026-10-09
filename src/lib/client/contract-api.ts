"use client";

import { apiFetch, uploadPdf } from "@/lib/client/api";
import type { ContractAudit, ContractAuditSummary, StoredContractAudit } from "@/lib/schemas/contract-audit";

export type AuditContractResponse = { audit: ContractAudit; fileName: string; model: string };

/** Unggah PDF kontrak ke `/api/audit-kontrak` (timeout lebih panjang: dokumen bisa puluhan halaman). */
export function uploadContract(file: File, handlers: Parameters<typeof uploadPdf>[2]) {
  return uploadPdf<AuditContractResponse>("/api/audit-kontrak", file, handlers, 300_000);
}

export function saveContractAudit(contractName: string, audit: ContractAudit) {
  return apiFetch<{ audit: ContractAuditSummary }>("/api/contract-audits", { json: { contractName, audit } });
}

export function fetchContractAudit(id: string, signal?: AbortSignal) {
  return apiFetch<{ audit: StoredContractAudit }>(`/api/contract-audits/${id}`, { signal });
}

export function removeContractAudit(id: string) {
  return apiFetch<{ ok: true }>(`/api/contract-audits/${id}`, { method: "DELETE" });
}
