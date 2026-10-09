import { NextResponse } from "next/server";
import { HttpError, assertXhr, handle } from "@/lib/api/http";
import { deleteContractAudit, getContractAudit } from "@/lib/data/contract-queries";
import { contractAuditIdSchema } from "@/lib/schemas/contract-audit";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const NOT_FOUND = "Audit kontrak tidak ditemukan.";

async function resolve(req: Parameters<typeof getSessionId>[0], ctx: Ctx) {
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(404, "not_found", NOT_FOUND);
  const parsed = contractAuditIdSchema.safeParse((await ctx.params).id);
  if (!parsed.success) throw new HttpError(404, "not_found", NOT_FOUND);
  return { sessionId, id: parsed.data };
}

/** GET /api/contract-audits/[id] — snapshot lengkap satu audit (scope sesi). */
export const GET = handle<Ctx>("GET /api/contract-audits/[id]", async (req, ctx) => {
  const { sessionId, id } = await resolve(req, ctx);
  const audit = await getContractAudit(sessionId, id);
  if (!audit) throw new HttpError(404, "not_found", NOT_FOUND);
  return NextResponse.json({ audit });
});

/** DELETE /api/contract-audits/[id] — hapus dari riwayat. */
export const DELETE = handle<Ctx>("DELETE /api/contract-audits/[id]", async (req, ctx) => {
  assertXhr(req);
  const { sessionId, id } = await resolve(req, ctx);
  if (!(await deleteContractAudit(sessionId, id))) throw new HttpError(404, "not_found", NOT_FOUND);
  return NextResponse.json({ ok: true });
});
