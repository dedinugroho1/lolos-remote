"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import { useEffect, useState } from "react";

const messages = [
  "AI sedang mencocokkan profil Anda...",
  "Mendeteksi syarat lokasi & zona waktu...",
  "Menghitung 5 kategori skor...",
  "Menyusun matched vs gaps...",
];

export function ScanningOverlay() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 rounded-2xl bg-card/90 p-6 backdrop-blur-sm"
    >
      <div className="relative h-40 w-32 overflow-hidden rounded-xl border bg-background shadow-lg [--scan-height:160px]">
        <div className="space-y-2 p-3">
          {[90, 70, 100, 60, 85, 75, 95, 50, 80].map((w, idx) => (
            <div key={idx} className="h-1.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="animate-scan absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-primary/25 to-transparent">
          <div className="absolute inset-x-0 bottom-1/2 h-0.5 bg-primary shadow-[0_0_12px_var(--primary)]" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-primary">
        <ScanSearch className="size-5" aria-hidden />
        <span className="font-heading font-bold">AI sedang menilai...</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-sm text-muted-foreground"
        >
          {messages[i]}
        </motion.p>
      </AnimatePresence>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="shimmer-bar h-full rounded-full"
          initial={{ width: "5%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 14, ease: [0.1, 0.7, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
