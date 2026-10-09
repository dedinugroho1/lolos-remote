import { NextResponse } from "next/server";
import { HttpError, assertXhr, handle, readJson } from "@/lib/api/http";
import { deleteApplication, getApplication, updateApplication } from "@/lib/data/queries";
import { applicationIdSchema, updateApplicationSchema } from "@/lib/schemas/application";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function resolve(req: Parameters<typeof getSessionId>[0], ctx: Ctx) {
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(404, "not_found", "Lamaran tidak ditemukan.");
  const parsed = applicationIdSchema.safeParse((await ctx.params).id);
  if (!parsed.success) throw new HttpError(404, "not_found", "Lamaran tidak ditemukan.");
  return { sessionId, id: parsed.data };
}

/** GET /api/applications/[id] — detail satu lamaran (scope sesi). */
export const GET = handle<Ctx>("GET /api/applications/[id]", async (req, ctx) => {
  const { sessionId, id } = await resolve(req, ctx);
  const application = await getApplication(sessionId, id);
  if (!application) throw new HttpError(404, "not_found", "Lamaran tidak ditemukan.");
  return NextResponse.json({ application });
});

/** PATCH /api/applications/[id] — ubah status dan/atau notes. */
export const PATCH = handle<Ctx>("PATCH /api/applications/[id]", async (req, ctx) => {
  assertXhr(req);
  const { sessionId, id } = await resolve(req, ctx);
  const patch = await readJson(req, updateApplicationSchema, 20 * 1024);
  const notes = patch.notes === undefined ? undefined : patch.notes?.trim() ? patch.notes.trim() : null;
  const application = await updateApplication(sessionId, id, { status: patch.status, ...(notes !== undefined ? { notes } : {}) });
  if (!application) throw new HttpError(404, "not_found", "Lamaran tidak ditemukan.");
  return NextResponse.json({ application });
});

/** DELETE /api/applications/[id] — hapus lamaran. */
export const DELETE = handle<Ctx>("DELETE /api/applications/[id]", async (req, ctx) => {
  assertXhr(req);
  const { sessionId, id } = await resolve(req, ctx);
  if (!(await deleteApplication(sessionId, id))) throw new HttpError(404, "not_found", "Lamaran tidak ditemukan.");
  return NextResponse.json({ ok: true });
});
