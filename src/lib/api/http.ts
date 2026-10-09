import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";

export type ApiErrorBody = { error: { code: string; message: string; retryAfter?: number } };

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

export function jsonError(status: number, code: string, message: string, retryAfter?: number) {
  const body: ApiErrorBody = { error: { code, message, ...(retryAfter ? { retryAfter } : {}) } };
  return NextResponse.json(body, {
    status,
    headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
  });
}

/** Proteksi CSRF ringan (PRD Bab 8): wajib header `X-Requested-With: XMLHttpRequest`. */
export function assertXhr(req: NextRequest) {
  if (req.headers.get("x-requested-with") !== "XMLHttpRequest") {
    throw new HttpError(403, "forbidden", "Permintaan ditolak.");
  }
}

/** Tolak body yang melebihi batas sebelum dibaca (berdasarkan Content-Length). */
export function assertContentLength(req: NextRequest, maxBytes: number, message: string) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > maxBytes) throw new HttpError(413, "payload_too_large", message);
}

/** Baca & validasi body JSON dengan Zod (maks `maxBytes`). */
export async function readJson<S extends z.ZodType>(req: NextRequest, schema: S, maxBytes = 100 * 1024): Promise<z.infer<S>> {
  assertContentLength(req, maxBytes, "Ukuran data terlalu besar.");
  const text = await req.text();
  if (text.length > maxBytes) throw new HttpError(413, "payload_too_large", "Ukuran data terlalu besar.");
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new HttpError(400, "invalid_json", "Format data tidak valid.");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(400, "validation_error", parsed.error.issues[0]?.message ?? "Data tidak valid.");
  }
  return parsed.data;
}

/** Bungkus handler: ubah HttpError jadi respons JSON & log error tak terduga secara terstruktur. */
export function handle<Ctx>(route: string, fn: (req: NextRequest, ctx: Ctx) => Promise<Response>) {
  return async (req: NextRequest, ctx: Ctx): Promise<Response> => {
    try {
      return await fn(req, ctx);
    } catch (error) {
      if (error instanceof HttpError) return jsonError(error.status, error.code, error.message, error.retryAfter);
      console.error(
        JSON.stringify({
          level: "error",
          route,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack?.split("\n").slice(0, 4).join(" | ") : undefined,
        }),
      );
      return jsonError(500, "internal_error", "Terjadi kesalahan di server. Silakan coba lagi.");
    }
  };
}
