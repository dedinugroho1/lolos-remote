import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, isValidSessionId, sessionCookieOptions } from "@/lib/session-config";

/**
 * Anonymous Session: setiap pengunjung tanpa cookie valid mendapat UUID v4
 * sebagai `user_session_id` (cookie HttpOnly, SameSite=Lax, Secure di prod, 30 hari).
 * Cookie juga disuntikkan ke request saat ini agar Server Component & Route
 * Handler pada request pertama sudah melihat ID yang sama.
 */
export function middleware(request: NextRequest) {
  const existing = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (isValidSessionId(existing)) {
    const response = NextResponse.next();
    // Perpanjang masa berlaku (sliding 30 hari) hanya saat navigasi halaman, agar
    // tidak menimpa penghapusan cookie oleh `DELETE /api/profil-saya`.
    if (!request.nextUrl.pathname.startsWith("/api/")) {
      response.cookies.set(SESSION_COOKIE_NAME, existing, sessionCookieOptions);
    }
    return response;
  }

  const sessionId = crypto.randomUUID();
  request.cookies.set(SESSION_COOKIE_NAME, sessionId);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions);
  return response;
}

export const config = {
  // Lewati asset Next.js, gambar, favicon, dan file statis berekstensi.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|woff2?)$).*)"],
};
