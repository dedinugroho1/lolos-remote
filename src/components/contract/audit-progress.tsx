"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, FileSignature, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type AuditStage = "uploading" | "reading" | "analyzing" | "drafting";

const stages: { id: AuditStage; label: string }[] = [
  { id: "uploading", label: "Mengunggah kontrak dengan aman" },
  { id: "reading", label: "AI sedang membaca seluruh pasal kontrak..." },
  { id: "analyzing", label: "Menilai risiko tiap klausul" },
  { id: "drafting", label: "Menyusun ringkasan & draf negosiasi" },
];

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function AuditProgress({
  fileName,
  fileSize,
  stage,
  progress,
  onCancel,
}: {
  fileName: string;
  fileSize: number;
  stage: AuditStage;
  progress: number;
  onCancel: () => void;
}) {
  const currentIndex = stages.findIndex((s) => s.id === stage);
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-4">
        <span className="relative inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <FileSignature className="size-6" aria-hidden />
          <span aria-hidden className="absolute inset-x-2 top-2 h-0.5 animate-scan rounded-full bg-primary [--scan-height:40px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{fileName}</p>
          <p className="font-mono text-xs text-muted-foreground">{formatSize(fileSize)} · PDF</p>
        </div>
        <span className="font-mono text-2xl font-bold text-primary">{Math.round(progress)}%</span>
      </div>

      <Progress value={progress} aria-label="Progres audit kontrak" className="mt-6 h-2.5" indicatorClassName="shimmer-bar rounded-full" />

      <AnimatePresence mode="wait">
        <motion.p
          key={stage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-4 text-center text-sm font-semibold"
        >
          {stages[currentIndex]?.label}
        </motion.p>
      </AnimatePresence>

      <ol className="mt-6 space-y-2.5">
        {stages.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.id} className={cn("flex items-center gap-3 text-sm", !done && !active && "text-muted-foreground")}>
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full border",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-primary text-primary",
                )}
              >
                {done ? (
                  <Check className="size-3.5" strokeWidth={3} />
                ) : active ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Kontrak panjang bisa memakan waktu hingga 1-2 menit. Jangan tutup halaman ini.
      </p>
      <div className="mt-3 flex justify-center">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
          Batalkan
        </Button>
      </div>
    </div>
  );
}
