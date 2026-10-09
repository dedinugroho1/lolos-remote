import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-haiku-5-5";
export const CLAUDE_MODEL_FALLBACK = process.env.CLAUDE_MODEL_FALLBACK ?? "claude-sonnet-5-5";

/** Batas waktu per panggilan (PRD: retry 1x otomatis jika Claude > 25 detik). */
const REQUEST_TIMEOUT_MS = 25_000;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  if (!process.env.ANTHROPIC_API_KEY) throw new AiError("config", "ANTHROPIC_API_KEY belum diatur di server.");
  // maxRetries: 1 → SDK otomatis mengulang sekali untuk timeout/408/429/5xx.
  client = new Anthropic({ timeout: REQUEST_TIMEOUT_MS, maxRetries: 1 });
  return client;
}

export type AiErrorCode = "config" | "invalid_output" | "refusal" | "truncated" | "rate_limited" | "unavailable" | "timeout";

export class AiError extends Error {
  constructor(
    public code: AiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AiError";
  }
}

type Effort = NonNullable<Anthropic.OutputConfig["effort"]>;

type StructuredRequest = {
  /** Skema Zod yang dikirim ke API sebagai JSON schema (structured outputs). */
  schema: z.ZodType;
  system: string;
  content: Anthropic.ContentBlockParam[];
  maxTokens: number;
  /** Default "low" (ekstraksi cepat). Naikkan untuk analisis yang butuh penalaran lebih. */
  effort?: Effort;
  /** Override batas waktu per panggilan (default 25 detik), mis. untuk dokumen panjang. */
  timeoutMs?: number;
};

/** `raw` = JSON hasil model, BELUM divalidasi — pemanggil wajib `schema.safeParse()`. */
export type StructuredResult = { raw: unknown; model: string; usage: Anthropic.Usage };

/** Error yang layak dicoba ulang di model cadangan (kapasitas/server, bukan input salah). */
function isFallbackWorthy(error: unknown): boolean {
  return (
    error instanceof Anthropic.RateLimitError ||
    error instanceof Anthropic.InternalServerError ||
    (error instanceof Anthropic.APIError && typeof error.status === "number" && error.status >= 500)
  );
}

async function runOnce(model: string, req: StructuredRequest): Promise<StructuredResult> {
  const response = await getClient().messages.create(
    {
      model,
      max_tokens: req.maxTokens,
      system: req.system,
      // Ekstraksi/penilaian terstruktur: effort rendah = cepat & hemat, thinking tetap adaptif.
      output_config: { effort: req.effort ?? "low", format: zodOutputFormat(req.schema) },
      messages: [{ role: "user", content: req.content }],
    },
    req.timeoutMs ? { timeout: req.timeoutMs } : undefined,
  );

  if (response.stop_reason === "refusal") {
    throw new AiError("refusal", "AI menolak memproses dokumen ini.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new AiError("truncated", "Jawaban AI terpotong.");
  }
  // Respons bisa diawali blok `thinking` — ambil blok teks berdasarkan tipe, bukan posisi.
  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  try {
    return { raw: JSON.parse(text), model: response.model, usage: response.usage };
  } catch {
    throw new AiError("invalid_output", "Output AI bukan JSON yang valid.");
  }
}

/**
 * Panggil Claude dengan structured output (JSON schema dari Zod).
 * Model utama = `CLAUDE_MODEL`; jika gagal karena 429/5xx (setelah 1x retry SDK),
 * beralih ke `CLAUDE_MODEL_FALLBACK`.
 */
export async function generateStructured(req: StructuredRequest): Promise<StructuredResult> {
  try {
    return await runOnce(CLAUDE_MODEL, req);
  } catch (error) {
    if (isFallbackWorthy(error) && CLAUDE_MODEL_FALLBACK && CLAUDE_MODEL_FALLBACK !== CLAUDE_MODEL) {
      console.warn(
        JSON.stringify({
          level: "warn",
          event: "claude_fallback",
          from: CLAUDE_MODEL,
          to: CLAUDE_MODEL_FALLBACK,
          status: error instanceof Anthropic.APIError ? error.status : undefined,
        }),
      );
      try {
        return await runOnce(CLAUDE_MODEL_FALLBACK, req);
      } catch (fallbackError) {
        throw normalizeError(fallbackError);
      }
    }
    throw normalizeError(error);
  }
}

function normalizeError(error: unknown): AiError {
  if (error instanceof AiError) return error;
  if (error instanceof Anthropic.APIConnectionTimeoutError) return new AiError("timeout", "AI terlalu lama merespons.");
  if (error instanceof Anthropic.RateLimitError) return new AiError("rate_limited", "Layanan AI sedang padat.");
  if (error instanceof Anthropic.AuthenticationError) return new AiError("config", "API key Anthropic tidak valid.");
  if (error instanceof Anthropic.BadRequestError) return new AiError("invalid_output", error.message);
  if (error instanceof Anthropic.APIError) return new AiError("unavailable", error.message);
  return new AiError("unavailable", error instanceof Error ? error.message : String(error));
}
