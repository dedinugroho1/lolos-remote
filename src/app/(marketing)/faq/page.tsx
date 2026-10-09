import { ArrowRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaqExplorer } from "@/components/marketing/faq-explorer";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { faqCategories } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "Tanya Jawab (FAQ)",
  description:
    "Jawaban seputar privasi CV, batas ukuran PDF, model AI Claude yang dipakai, cara skor dihitung, dan cara reset sesi di LolosRemote.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Tanya Jawab"
        title="Ada yang ingin Anda tanyakan?"
        description="Kami kumpulkan pertanyaan yang paling sering muncul seputar privasi, unggah CV, cara kerja AI, dan pengelolaan sesi."
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <FaqExplorer categories={faqCategories} />
        </FadeIn>
        <FadeIn className="mt-12">
          <div className="flex flex-col items-start gap-5 rounded-2xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Mail className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-bold">Masih penasaran?</p>
                <p className="text-sm text-muted-foreground">Cara terbaik memahami LolosRemote adalah mencobanya langsung — gratis.</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/upload">
                Coba Sekarang <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
