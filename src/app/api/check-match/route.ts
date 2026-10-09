import { NextResponse } from "next/server";
import { aiErrorToHttp } from "@/lib/ai/errors";
import { MATCH_SYSTEM, buildMatchPrompt } from "@/lib/ai/prompts";
import { AiError, generateStructured } from "@/lib/anthropic";
import { HttpError, assertXhr, handle, readJson } from "@/lib/api/http";
import { getCvProfile } from "@/lib/data/queries";
import { consumeRateLimit } from "@/lib/rate-limit";
import { sanitizeJobDescription } from "@/lib/sanitize";
import { checkMatchRequestSchema } from "@/lib/schemas/application";
import { jobMatchSchema } from "@/lib/schemas/job-match";
import { sumBreakdown } from "@/lib/score";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_TOKENS = Number(process.env.CLAUDE_MAX_TOKENS_MATCH ?? 6000);
const ROUTE = "POST /api/check-match";

/** POST /api/check-match — nilai kecocokan CV vs JD. Hasil TIDAK disimpan ke DB. */
export const POST = handle(ROUTE, async (req) => {
  assertXhr(req);
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(401, "no_session", "Sesi Anda tidak ditemukan. Muat ulang halaman lalu unggah CV.");

  const { jobDescription } = await readJson(req, checkMatchRequestSchema, 100 * 1024);
  const cleanJd = sanitizeJobDescription(jobDescription);
  if (cleanJd.length < 50) throw new HttpError(400, "jd_too_short", "Job Description minimal 50 karakter");

  const cv = await getCvProfile(sessionId);
  if (!cv) throw new HttpError(409, "no_cv", "Unggah CV dulu sebelum mengecek lowongan");

  consumeRateLimit("checkMatch", sessionId);

  try {
    const { raw, model } = await generateStructured({
      schema: jobMatchSchema,
      system: MATCH_SYSTEM,
      maxTokens: MAX_TOKENS,
      content: [{ type: "text", text: buildMatchPrompt(cv.profileJson, cleanJd) }],
    });

    const parsed = jobMatchSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(JSON.stringify({ level: "error", route: ROUTE, event: "zod_invalid", issues: parsed.error.issues.slice(0, 5) }));
      throw new HttpError(502, "ai_invalid_output", "AI gagal menilai lowongan ini, coba lagi");
    }

    // Skor akhir = penjumlahan 5 kategori, dibulatkan (bobot dikunci, tidak dipercaya mentah dari AI).
    const result = { ...parsed.data, fit_score: Math.min(100, Math.max(0, sumBreakdown(parsed.data.score_breakdown))) };
    return NextResponse.json({ result, jobDescription: cleanJd, model });
  } catch (error) {
    if (error instanceof AiError) throw aiErrorToHttp(error, "match", ROUTE);
    throw error;
  }
});
