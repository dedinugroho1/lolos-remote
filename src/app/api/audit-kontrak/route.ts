import { NextResponse } from "next/server";
import { AiError, generateStructured } from "@/lib/anthropic";
import { AUDIT_CONTRACT_INSTRUCTION, AUDIT_CONTRACT_SYSTEM } from "@/lib/ai/contract-prompts";
import { aiErrorToHttp } from "@/lib/ai/errors";
import { HttpError, assertContentLength, assertXhr, handle } from "@/lib/api/http";
import { consumeRateLimit } from "@/lib/rate-limit";
import { MAX_CONTRACT_BYTES, contractAuditSchema, normalizeAudit } from "@/lib/schemas/contract-audit";
import { getOrCreateSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Kontrak panjang + analisis klausul butuh waktu lebih lama dibanding parse CV.
export const maxDuration = 300;

const MAX_TOKENS = Number(process.env.CLAUDE_MAX_TOKENS_AUDIT ?? 16000);
const AUDIT_TIMEOUT_MS = Number(process.env.CLAUDE_TIMEOUT_AUDIT_MS ?? 120_000);
const SIZE_MESSAGE = "File maksimal 10MB";

/**
 * POST /api/audit-kontrak — terima PDF kontrak, audit klausul via Claude.
 * Hasil TIDAK disimpan otomatis; user menyimpan lewat `POST /api/contract-audits`.
 */
export const POST = handle("POST /api/audit-kontrak", async (req) => {
  assertXhr(req);
  assertContentLength(req, MAX_CONTRACT_BYTES + 64 * 1024, SIZE_MESSAGE);

  const sessionId = await getOrCreateSessionId();

  const form = await req.formData().catch(() => {
    throw new HttpError(400, "invalid_form", "Unggahan tidak valid.");
  });
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "missing_file", "Pilih file kontrak terlebih dahulu.");
  if (file.type !== "application/pdf") throw new HttpError(415, "invalid_type", "Format file harus PDF");
  if (file.size > MAX_CONTRACT_BYTES) throw new HttpError(413, "file_too_large", SIZE_MESSAGE);
  if (file.size === 0) throw new HttpError(400, "empty_file", "File kosong. Pilih file kontrak lain.");

  // PDF hanya ada di memori selama request — tidak pernah disimpan ke disk/DB.
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new HttpError(415, "invalid_type", "Format file harus PDF");
  }

  consumeRateLimit("auditContract", sessionId);

  try {
    const { raw, model } = await generateStructured({
      schema: contractAuditSchema,
      system: AUDIT_CONTRACT_SYSTEM,
      maxTokens: MAX_TOKENS,
      // Penilaian risiko hukum butuh penalaran lebih dari sekadar ekstraksi.
      effort: "medium",
      timeoutMs: AUDIT_TIMEOUT_MS,
      content: [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: bytes.toString("base64") } },
        { type: "text", text: AUDIT_CONTRACT_INSTRUCTION },
      ],
    });

    const parsed = contractAuditSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(JSON.stringify({ level: "error", route: "POST /api/audit-kontrak", event: "zod_invalid", issues: parsed.error.issues.slice(0, 5) }));
      throw new HttpError(502, "invalid_output", "AI gagal mengaudit kontrak, coba lagi");
    }
    if (!parsed.data.is_employment_contract) {
      throw new HttpError(422, "not_a_contract", "Dokumen ini sepertinya bukan kontrak kerja. Unggah file kontrak atau offer letter Anda.");
    }

    return NextResponse.json({
      audit: normalizeAudit(parsed.data),
      fileName: file.name.slice(0, 200) || "Kontrak.pdf",
      model,
    });
  } catch (error) {
    if (error instanceof AiError) throw aiErrorToHttp(error, "contract", "POST /api/audit-kontrak");
    throw error;
  }
});
