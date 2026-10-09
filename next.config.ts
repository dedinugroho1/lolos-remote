import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opsional: folder build terpisah agar beberapa dev server bisa berjalan di folder yang sama.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Middleware sesi juga berjalan di /api/*. Default Next membuffer maks 10MB body per
    // request; PDF kontrak 10MB + overhead multipart butuh sedikit lebih (lihat /api/audit-kontrak).
    middlewareClientMaxBodySize: "11mb",
  },
};

export default nextConfig;
