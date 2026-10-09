import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { getCurrentCv } from "@/lib/data/current";

// Halaman personal per sesi — wajib noindex (PRD Bab 8) & selalu dinamis (bergantung cookie).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cv = await getCurrentCv();

  return (
    <div className="bg-grid relative flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-primary/[0.07] via-background/60 to-transparent"
      />
      <AppHeader cv={cv ? { originalFileName: cv.originalFileName, updatedAt: cv.updatedAt } : null} />
      <main id="konten" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t py-5 text-center text-xs text-muted-foreground">
        Data Anda hanya dapat diakses dari browser ini melalui sesi anonim · Tanpa akun, tanpa email
      </footer>
    </div>
  );
}
