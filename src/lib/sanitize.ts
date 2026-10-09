/**
 * Bersihkan teks Job Description sebelum dikirim ke Claude:
 * buang blok <script>/<style>/<iframe>, tag HTML, entity umum, dan karakter kontrol.
 */
export function sanitizeJobDescription(input: string, maxLength = 15_000): string {
  return input
    .replace(/<\s*(script|style|iframe|object|embed|noscript)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, " ")
    .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}
