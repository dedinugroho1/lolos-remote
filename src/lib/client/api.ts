"use client";

import type { StoredCvProfile } from "@/lib/schemas/application";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const NETWORK_MESSAGE = "Koneksi terputus. Periksa internet Anda lalu coba lagi.";

function toApiError(status: number, body: unknown): ApiError {
  const err = (body as { error?: { code?: string; message?: string; retryAfter?: number } } | null)?.error;
  return new ApiError(status, err?.code ?? "unknown", err?.message ?? "Terjadi kesalahan. Silakan coba lagi.", err?.retryAfter);
}

/** Fetch ke Route Handler internal (same-origin) dengan header anti-CSRF. */
export async function apiFetch<T>(path: string, init: { method?: string; json?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: init.method ?? (init.json !== undefined ? "POST" : "GET"),
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        ...(init.json !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
      signal: init.signal,
      credentials: "same-origin",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "network", NETWORK_MESSAGE);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw toApiError(res.status, body);
  return body as T;
}

type UploadHandlers = { onUploadProgress?: (ratio: number) => void; onUploaded?: () => void };

/**
 * Unggah satu file PDF (multipart, field `file`) via XHR agar progres upload asli bisa
 * ditampilkan. `onUploadProgress` menerima 0..1; `onUploaded` dipanggil saat file selesai
 * terkirim (server lalu memproses dengan AI).
 */
export function uploadPdf<T>(
  path: string,
  file: File,
  handlers: UploadHandlers,
  timeoutMs = 90_000,
): { promise: Promise<T>; abort: () => void } {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<T>((resolve, reject) => {
    xhr.open("POST", path);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) handlers.onUploadProgress?.(e.loaded / e.total);
    };
    xhr.upload.onload = () => handlers.onUploaded?.();
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response as T);
      else reject(toApiError(xhr.status, xhr.response));
    };
    xhr.onerror = () => reject(new ApiError(0, "network", NETWORK_MESSAGE));
    xhr.ontimeout = () => reject(new ApiError(0, "timeout", "Waktu habis. Silakan coba lagi."));
    xhr.onabort = () => reject(new DOMException("Dibatalkan", "AbortError"));
    xhr.timeout = timeoutMs;
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
  return { promise, abort: () => xhr.abort() };
}

/** Unggah CV ke `/api/parse-cv`. */
export function uploadCv(file: File, handlers: UploadHandlers): { promise: Promise<{ profile: StoredCvProfile }>; abort: () => void } {
  return uploadPdf<{ profile: StoredCvProfile }>("/api/parse-cv", file, handlers);
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function errorMessage(error: unknown, fallback = "Terjadi kesalahan. Silakan coba lagi.") {
  return error instanceof ApiError ? error.message : fallback;
}
