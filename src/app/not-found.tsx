import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-grid flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Logo />
      <p className="mt-10 font-mono text-7xl font-bold text-primary/20">404</p>
      <span className="mt-2 inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        <Compass className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Sepertinya halaman yang Anda cari sudah pindah atau tidak pernah ada.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" /> Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/upload">Mulai Cek CV</Link>
        </Button>
      </div>
    </main>
  );
}
