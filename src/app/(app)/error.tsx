"use client";

import { RotateCcw, ServerCrash } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center shadow-sm">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <ServerCrash className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-xl font-bold">Data Anda gagal dimuat</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Koneksi ke server sedang bermasalah. Data Anda aman — silakan coba beberapa saat lagi.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RotateCcw data-icon="inline-start" /> Coba Lagi
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
