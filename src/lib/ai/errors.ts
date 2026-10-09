import "server-only";
import type { AiError } from "@/lib/anthropic";
import { HttpError } from "@/lib/api/http";

export type AiTaskKind = "parse" | "match" | "contract";

const messages: Record<AiTaskKind, { failed: string; refusal: string; timeout: string }> = {
  parse: {
    failed: "AI gagal membaca CV, coba lagi",
    refusal: "AI tidak dapat memproses dokumen ini. Coba unggah CV lain.",
    timeout: "AI terlalu lama membaca CV. Silakan coba lagi.",
  },
  match: {
    failed: "AI gagal menilai lowongan ini, coba lagi",
    refusal: "AI tidak dapat memproses lowongan ini. Coba Job Description lain.",
    timeout: "AI terlalu lama menilai lowongan. Silakan coba lagi.",
  },
  contract: {
    failed: "AI gagal mengaudit kontrak, coba lagi",
    refusal: "AI tidak dapat memproses dokumen ini. Coba unggah kontrak lain.",
    timeout: "AI terlalu lama mengaudit kontrak. Silakan coba lagi.",
  },
};

/** Terjemahkan AiError menjadi HttpError dengan pesan ramah pengguna (Bahasa Indonesia). */
export function aiErrorToHttp(error: AiError, kind: AiTaskKind, route: string): HttpError {
  console.error(JSON.stringify({ level: "error", route, event: "ai_error", code: error.code, message: error.message }));
  switch (error.code) {
    case "config":
      return new HttpError(500, "ai_config", "Layanan AI belum dikonfigurasi. Hubungi admin.");
    case "refusal":
      return new HttpError(422, "ai_refusal", messages[kind].refusal);
    case "rate_limited":
      return new HttpError(503, "ai_busy", "Layanan AI sedang padat. Coba lagi dalam beberapa saat.");
    case "timeout":
      return new HttpError(504, "ai_timeout", messages[kind].timeout);
    case "unavailable":
      return new HttpError(503, "ai_unavailable", "Layanan AI sedang tidak tersedia. Coba lagi dalam beberapa saat.");
    case "invalid_output":
    case "truncated":
      return new HttpError(502, "ai_invalid_output", messages[kind].failed);
  }
}
