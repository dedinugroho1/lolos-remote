"use client";

import { motion } from "framer-motion";
import { Check, Clock3, MapPin, TriangleAlert, Wallet } from "lucide-react";
import { ScoreRing } from "@/components/score/score-ring-lazy";

const matched = ["React", "Next.js", "TypeScript", "Tailwind"];

/** Kartu demo animasi di hero — meniru tampilan halaman hasil. */
export function HeroPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div aria-hidden className="bg-gradient-brand absolute -inset-4 -z-10 rounded-[2rem] opacity-20 blur-2xl" />
      <div className="rounded-3xl border bg-card/95 p-6 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Northwind Labs</p>
            <p className="font-heading text-lg font-bold">Senior Frontend Engineer</p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
            Remote
          </span>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <ScoreRing score={78} size={150} thickness={14} />
          <div className="flex-1 space-y-2.5">
            {[
              ["Skill Wajib", 33, 40],
              ["Pengalaman", 15, 20],
              ["Domain", 12, 15],
            ].map(([label, v, max], i) => (
              <div key={label as string}>
                <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                  <span>{label}</span>
                  <span className="font-mono text-foreground">
                    {v}/{max}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-success"
                    initial={{ width: 0 }}
                    animate={{ width: `${((v as number) / (max as number)) * 100}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.12, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-xl bg-muted/70 px-2.5 py-2">
            <MapPin className="size-3.5 text-primary" aria-hidden /> Worldwide
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-muted/70 px-2.5 py-2">
            <Clock3 className="size-3.5 text-primary" aria-hidden /> 4 jam overlap WIB
          </div>
          <div className="col-span-2 flex items-center gap-1.5 rounded-xl bg-muted/70 px-2.5 py-2">
            <Wallet className="size-3.5 text-primary" aria-hidden /> USD 4.000 - 6.000/bulan
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {matched.map((m, i) => (
            <motion.span
              key={m}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.08 }}
              className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300"
            >
              <Check className="size-3" strokeWidth={3} aria-hidden />
              {m}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300"
          >
            Gap: GraphQL
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="animate-float absolute -right-3 -bottom-5 flex items-center gap-2 rounded-2xl border bg-card px-3.5 py-2.5 text-xs font-semibold shadow-lg sm:-right-8"
      >
        <TriangleAlert className="size-4 text-warning" aria-hidden />
        Overlap 4 jam CET terdeteksi
      </motion.div>
    </motion.div>
  );
}
