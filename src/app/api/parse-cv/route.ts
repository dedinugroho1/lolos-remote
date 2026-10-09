import { NextResponse } from "next/server";
import { AiError, generateStructured } from "@/lib/anthropic";
import { aiErrorToHttp } from "@/lib/ai/errors";
import { NOT_A_CV_MARKER, PARSE_CV_INSTRUCTION, PARSE_CV_SYSTEM } from "@/lib/ai/prompts";
import { HttpError, assertContentLength, assertXhr, handle } from "@/lib/api/http";
import { upsertCvProfile } from "@/lib/data/queries";
import { consumeRateLimit } from "@/lib/rate-limit";
import { cvProfileSchema } from "@/lib/schemas/cv-profile";
import { getOrCreateSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOKENS = Number(process.env.CLAUDE_MAX_TOKENS_PARSE ?? 8000);

/** POST /api/parse-cv — terima PDF, ekstrak via Claude, UPSERT `cv_profiles`. */
export const POST = handle("POST /api/parse-cv", async (req) => {
  assertXhr(req);
  // Batas body 5MB + overhead multipart.
  assertContentLength(req, MAX_FILE_BYTES + 64 * 1024, "File maksimal 5MB");

  const sessionId = await getOrCreateSessionId();

  const form = await req.formData().catch(() => {
    throw new HttpError(400, "invalid_form", "Unggahan tidak valid.");
  });
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "missing_file", "Pilih file CV terlebih dahulu.");
  if (file.type !== "application/pdf") throw new HttpError(415, "invalid_type", "Format file harus PDF");
  if (file.size > MAX_FILE_BYTES) throw new HttpError(413, "file_too_large", "File maksimal 5MB");
  if (file.size === 0) throw new HttpError(400, "empty_file", "File kosong. Pilih file CV lain.");

  // PDF hanya ada di memori selama request — tidak pernah disimpan ke disk/DB.
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new HttpError(415, "invalid_type", "Format file harus PDF");
  }

  // Kuota hanya terpakai untuk file valid yang benar-benar dikirim ke AI.
  consumeRateLimit("parseCv", sessionId);

  try {
    const { raw, model } = await generateStructured({
      schema: cvProfileSchema,
      system: PARSE_CV_SYSTEM,
      maxTokens: MAX_TOKENS,
      content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: bytes.toString("base64") } },
        { type: "text", text: PARSE_CV_INSTRUCTION },
      ],
    });

    if (raw && typeof raw === "object" && (raw as { summary?: unknown }).summary === NOT_A_CV_MARKER) {
      throw new HttpError(422, "not_a_cv", "Dokumen ini sepertinya bukan CV. Unggah file CV/resume Anda.");
    }

    const parsed = cvProfileSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(JSON.stringify({ level: "error", route: "POST /api/parse-cv", event: "zod_invalid", issues: parsed.error.issues.slice(0, 5) }));
      throw new HttpError(502, "invalid_output", "AI gagal membaca CV, coba lagi");
    }

    const fileName = file.name.slice(0, 200) || "CV.pdf";
    const profile = await upsertCvProfile(sessionId, parsed.data, fileName, model);
    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof AiError) throw aiErrorToHttp(error, "parse", "POST /api/parse-cv");
    throw error;
  }
});
