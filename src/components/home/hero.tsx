"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CircleCheck, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroPreviewCard } from "@/components/home/hero-preview-card";
import { Button } from "@/components/ui/button";

const avatars = [
  { initials: "RA", className: "bg-indigo-500" },
  { initials: "DS", className: "bg-emerald-500" },
  { initials: "NF", className: "bg-amber-500" },
  { initials: "BP", className: "bg-rose-500" },
];

export function Hero() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const x = useSpring(mx, { stiffness: 140, damping: 22, mass: 0.4 });
  const y = useSpring(my, { stiffness: 140, damping: 22, mass: 0.4 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${x}px ${y}px, color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)`;

  return (
    <section
      className="bg-grid relative -mt-16 overflow-hidden pt-16"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      onMouseLeave={() => {
        mx.set(-1000);
        my.set(-1000);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur"
          >
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Gratis · Tanpa daftar akun · Ditenagai Claude AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.6rem]"
          >
            Cek 1 Klik, <span className="text-gradient-brand">Sebelum Buang Waktu</span> Melamar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Unggah CV sekali, tempel Job Description lowongan remote, dan dapatkan skor kecocokan 0-100 dalam hitungan
            detik — lengkap dengan syarat tersembunyi seperti <strong className="text-foreground">&ldquo;US Only&rdquo;</strong>,
            zona waktu, dan skill yang belum Anda kuasai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="xl" className="shadow-xl shadow-primary/25">
              <Link href="/upload" aria-label="Mulai cek kecocokan CV sekarang">
                Mulai Cek Sekarang <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="bg-card/70 backdrop-blur">
              <Link href="#cara-kerja">
                <PlayCircle data-icon="inline-start" /> Lihat Cara Kerjanya
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatars.map((a) => (
                  <span
                    key={a.initials}
                    className={`${a.className} inline-flex size-9 items-center justify-center rounded-full border-2 border-background text-xs font-bold text-white`}
                    aria-hidden
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-mono font-bold text-foreground">2.400+</span> pencari kerja
                <br className="hidden sm:block" /> sudah cek sebelum melamar
              </p>
            </div>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <CircleCheck className="size-4 text-success" aria-hidden /> Hasil &lt; 15 detik
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-success" aria-hidden /> File PDF tidak disimpan
              </li>
            </ul>
          </motion.div>
        </div>

        <HeroPreviewCard />
      </div>
    </section>
  );
}
