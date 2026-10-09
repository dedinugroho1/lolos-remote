"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleCheckBig, FileCheck2, Info, RefreshCw, RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FlowSteps } from "@/components/app/flow-steps";
import { PageHeader } from "@/components/app/page-header";
import { ProfilePreview } from "@/components/profile/profile-preview";
import { CvDropzone } from "@/components/upload/cv-dropzone";
import { ParsingProgress, type ParseStage } from "@/components/upload/parsing-progress";
import { Button } from "@/components/ui/button";
import { ApiError, errorMessage, isAbortError, uploadCv } from "@/lib/client/api";
import { formatDateTime, seniorityLabel } from "@/lib/format";
import type { StoredCvProfile } from "@/lib/schemas/application";

type Phase =
  | { kind: "idle" }
  | { kind: "working"; file: File; stage: ParseStage; progress: number }
  | { kind: "done"; profile: StoredCvProfile }
  | { kind: "error"; message: string; file: File; retryable: boolean };

/** Bagian bar progres: 0-30% = upload asli, 30-95% = menunggu AI (asimtotik). */
const UPLOAD_SHARE = 30;

export function UploadFlow({ initialCv, notice }: { initialCv: StoredCvProfile | null; notice?: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [updating, setUpdating] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTicker = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  useEffect(
    () => () => {
      stopTicker();
      abortRef.current?.();
    },
    [],
  );

  const cv = phase.kind === "done" ? phase.profile : initialCv;

  async function handleFile(file: File) {
    stopTicker();
    setPhase({ kind: "working", file, stage: "uploading", progress: 0 });

    const { promise, abort } = uploadCv(file, {
      onUploadProgress: (ratio) =>
        setPhase((p) => (p.kind === "working" && p.stage === "uploading" ? { ...p, progress: ratio * UPLOAD_SHARE } : p)),
      onUploaded: () => {
        // Upload selesai → server mengirim PDF ke Claude. Progres naik perlahan mendekati 95%.
        const startedAt = Date.now();
        setPhase((p) => (p.kind === "working" ? { ...p, stage: "parsing", progress: UPLOAD_SHARE } : p));
        tickRef.current = setInterval(() => {
          const elapsed = (Date.now() - startedAt) / 1000;
          const progress = UPLOAD_SHARE + (95 - UPLOAD_SHARE) * (1 - Math.exp(-elapsed / 9));
          setPhase((p) =>
            p.kind === "working" ? { ...p, progress, stage: progress > 80 ? "validating" : "parsing" } : p,
          );
        }, 200);
      },
    });
    abortRef.current = abort;

    try {
      const { profile } = await promise;
      stopTicker();
      setUpdating(false);
      setPhase({ kind: "done", profile });
      toast.success("CV berhasil dibaca!", { description: "Periksa ringkasan profil Anda di bawah." });
      router.refresh(); // perbarui indikator "CV Tersimpan" di header
    } catch (error) {
      stopTicker();
      if (isAbortError(error)) return;
      const message = errorMessage(error, "AI gagal membaca CV, coba lagi");
      // Format/ukuran salah atau kuota habis tidak akan berhasil bila diulang dengan file yang sama.
      const retryable = !(error instanceof ApiError && [413, 415, 422, 429].includes(error.status));
      setPhase({ kind: "error", message, file, retryable });
      toast.error(message);
    } finally {
      abortRef.current = null;
    }
  }

  function cancel() {
    stopTicker();
    abortRef.current?.();
    setPhase({ kind: "idle" });
    toast("Proses dibatalkan");
  }

  const showSavedCard = cv && phase.kind === "idle" && !updating;
  const showDropzone = phase.kind === "idle" && (!cv || updating);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <FlowSteps current={0} />
        <PageHeader
          title={phase.kind === "done" ? "Profil Anda siap!" : updating ? "Perbarui CV Anda" : "Unggah CV Anda"}
          description={
            phase.kind === "done"
              ? "Periksa ringkasan profil hasil bacaan AI. Jika sudah sesuai, lanjutkan ke pengecekan lowongan."
              : "Cukup sekali. Setelah CV terbaca, Anda bisa mengecek puluhan lowongan tanpa upload ulang."
          }
        />
      </div>

      {notice && !cv && phase.kind === "idle" && (
        <p className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.05] px-4 py-3 text-sm">
          <Info className="size-4 shrink-0 text-primary" aria-hidden /> {notice}
        </p>
      )}

      <AnimatePresence mode="wait">
        {showSavedCard && cv && (
          <motion.div key="saved" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="relative overflow-hidden rounded-2xl border border-success/30 bg-card p-6 shadow-sm sm:p-8">
              <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-success/10 blur-2xl" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                  <FileCheck2 className="size-7" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">CV Anda Sudah Tersimpan</h2>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{cv.originalFileName ?? "CV.pdf"}</span> ·{" "}
                    {seniorityLabel[cv.profileJson.seniority_level]} · {cv.profileJson.technical_skills.length} skill ·
                    diperbarui {formatDateTime(cv.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/check">
                    Lanjut Cek Lowongan <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" onClick={() => setUpdating(true)}>
                  <RefreshCw data-icon="inline-start" /> Perbarui CV
                </Button>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold">Profil tersimpan</h2>
              <ProfilePreview profile={cv.profileJson} />
            </div>
          </motion.div>
        )}

        {showDropzone && (
          <motion.div key="dropzone" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <CvDropzone onFile={handleFile} />
            {updating && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-warning/10 px-4 py-3 text-sm">
                <span>CV baru akan menimpa profil lama Anda (hanya 1 CV aktif per perangkat).</span>
                <Button variant="ghost" size="sm" onClick={() => setUpdating(false)}>
                  Batal
                </Button>
              </div>
            )}
            <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {["AI membaca PDF secara langsung", "Hasil berupa profil terstruktur", "Bisa diperbarui kapan saja"].map((t) => (
                <p key={t} className="flex items-center gap-2">
                  <CircleCheckBig className="size-4 text-success" aria-hidden /> {t}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {phase.kind === "working" && (
          <motion.div key="working" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto max-w-xl">
            <ParsingProgress
              fileName={phase.file.name}
              fileSize={phase.file.size}
              stage={phase.stage}
              progress={phase.progress}
              onCancel={cancel}
            />
          </motion.div>
        )}

        {phase.kind === "error" && (
          <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl">
            <div role="alert" className="rounded-2xl border border-danger/30 bg-card p-8 text-center shadow-sm">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <TriangleAlert className="size-7" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-bold">{phase.message}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {phase.retryable
                  ? "Pastikan file berisi teks CV yang dapat dibaca (bukan hasil scan buram) lalu coba lagi."
                  : "Silakan periksa file Anda atau coba lagi nanti."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                {phase.retryable && (
                  <Button onClick={() => handleFile(phase.file)}>
                    <RotateCcw data-icon="inline-start" /> Baca Ulang CV
                  </Button>
                )}
                <Button variant="outline" onClick={() => setPhase({ kind: "idle" })}>
                  Pilih File Lain
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {phase.kind === "done" && (
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-success/30 bg-success/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2.5 text-sm">
                <CircleCheckBig className="size-5 shrink-0 text-success" aria-hidden />
                <span>
                  <strong>{phase.profile.originalFileName}</strong> berhasil dibaca oleh{" "}
                  <span className="font-mono text-xs">{phase.profile.claudeModel}</span>.
                </span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhase({ kind: "idle" });
                    setUpdating(true);
                  }}
                >
                  <RotateCcw data-icon="inline-start" /> Baca Ulang CV
                </Button>
                <Button asChild>
                  <Link href="/check">
                    Lanjut Cek Lowongan <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
            <ProfilePreview profile={phase.profile.profileJson} />
            <div className="flex justify-center pt-2">
              <Button asChild size="xl" className="shadow-xl shadow-primary/20">
                <Link href="/check">
                  Lanjut Cek Lowongan <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
