import { NextResponse } from "next/server";
import { HttpError, assertXhr, handle, readJson } from "@/lib/api/http";
import { insertContractAudit, listContractAudits } from "@/lib/data/contract-queries";
import { countFindings, normalizeAudit, saveContractAuditRequestSchema } from "@/lib/schemas/contract-audit";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/contract-audits — daftar ringkas audit tersimpan milik sesi. */
export const GET = handle("GET /api/contract-audits", async (req) => {
  const sessionId = getSessionId(req);
  const audits = sessionId ? await listContractAudits(sessionId) : [];
  return NextResponse.json({ audits });
});

/** POST /api/contract-audits — bookmark hasil audit ke riwayat. */
export const POST = handle("POST /api/contract-audits", async (req) => {
  assertXhr(req);
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(401, "no_session", "Sesi Anda tidak ditemukan. Muat ulang halaman.");

  const body = await readJson(req, saveContractAuditRequestSchema, 300 * 1024);
  const audit = normalizeAudit(body.audit);

  const saved = await insertContractAudit({
    userSessionId: sessionId,
    contractName: body.contractName,
    safetyScore: audit.safety_score,
    // Dihitung ulang dari temuan — tidak mempercayai angka dari client.
    redFlagsCount: countFindings(audit.findings).red_flag,
    auditSummaryJson: audit,
  });

  return NextResponse.json({ audit: saved }, { status: 201 });
});
