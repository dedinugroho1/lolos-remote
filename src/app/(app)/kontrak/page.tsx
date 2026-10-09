import type { Metadata } from "next";
import { ContractAuditFlow } from "@/components/contract/contract-audit-flow";
import { listContractAudits } from "@/lib/data/contract-queries";
import { readSessionId } from "@/lib/session";

export const metadata: Metadata = { title: "Audit Kontrak Kerja Remote" };

export default async function KontrakPage() {
  const sessionId = await readSessionId();
  const saved = sessionId ? await listContractAudits(sessionId) : [];
  return <ContractAuditFlow initialSaved={saved} />;
}
