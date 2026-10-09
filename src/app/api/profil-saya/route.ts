import { NextResponse } from "next/server";
import { HttpError, assertXhr, handle } from "@/lib/api/http";
import { deleteAllSessionData } from "@/lib/data/queries";
import { clearSessionCookie, getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** DELETE /api/profil-saya — hapus profil CV + semua lamaran sesi, lalu hapus cookie. */
export const DELETE = handle("DELETE /api/profil-saya", async (req) => {
  assertXhr(req);
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(401, "no_session", "Sesi Anda tidak ditemukan.");
  const deleted = await deleteAllSessionData(sessionId);
  await clearSessionCookie();
  return NextResponse.json({ ok: true, deleted });
});
