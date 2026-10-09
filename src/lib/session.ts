import "server-only";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, isValidSessionId, sessionCookieOptions } from "@/lib/session-config";

/** Ambil `user_session_id` dari request (Route Handler). `null` jika tidak ada/invalid. */
export function getSessionId(req: NextRequest): string | null {
  const value = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return isValidSessionId(value) ? value : null;
}

/** Ambil `user_session_id` di Server Component / Route Handler via `next/headers`. */
export async function readSessionId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE_NAME)?.value;
  return isValidSessionId(value) ? value : null;
}

/**
 * Untuk Route Handler yang boleh membuat sesi (mis. `/api/parse-cv`):
 * pakai cookie yang ada, atau buat UUID baru dan set cookie-nya.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE_NAME)?.value;
  if (isValidSessionId(value)) return value;
  const sessionId = crypto.randomUUID();
  store.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions);
  return sessionId;
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, "", { ...sessionCookieOptions, maxAge: 0 });
}
