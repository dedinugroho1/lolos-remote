/** Konfigurasi cookie sesi anonim (aman dipakai di Edge middleware & Node). */
export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "lolosremote_session";
export const SESSION_COOKIE_MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 24 * 30); // 30 hari

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidSessionId(value: string | undefined | null): value is string {
  return typeof value === "string" && UUID_V4.test(value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
};
