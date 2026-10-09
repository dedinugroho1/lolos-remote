import { NextResponse } from "next/server";
import { handle } from "@/lib/api/http";
import { listApplications } from "@/lib/data/queries";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/applications — seluruh riwayat lamaran milik sesi (terbaru dulu). */
export const GET = handle("GET /api/applications", async (req) => {
  const sessionId = getSessionId(req);
  if (!sessionId) return NextResponse.json({ applications: [] });
  return NextResponse.json({ applications: await listApplications(sessionId) });
});
