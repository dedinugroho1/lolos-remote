"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckBig, RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/page-header";
import { AuditProgress, type AuditStage } from "@/components/contract/audit-progress";
import { AuditResult, type AuditView } from "@/components/contract/audit-result";
import { ContractDropzone } from "@/components/contract/contract-dropzone";
import { SavedAudits } from "@/components/contract/saved-audits";
import { Button } from "@/components/ui/button";
import { ApiError, errorMessage, isAbortError } from "@/lib/client/api";
import { fetchContractAudit, removeContractAudit, saveContractAudit, uploadContract } from "@/lib/client/contract-api";
import type { ContractAuditSummary } from "@/lib/schemas/contract-audit";

type Phase =
  | { kind: "idle" }
  | { kind: "working"; file: File; stage: AuditStage; progress: number }
  | { kind: "done"; view: AuditView }
  | { kind: "error"; message: string; file: File; retryable: boolean };

/** Bagian bar progres: 0-20% = upload asli, 20-95% = menunggu AI (asimtotik). */
const UPLOAD_SHARE = 20;

function stageFor(progress: number): AuditStage {
  if (progress < 50) return "reading";
  if (progress < 82) return "analyzing";
  return "drafting";
}

export function ContractAuditFlow({ initialSaved }: { initialSaved: ContractAuditSummary[] }) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
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

  function showResult(view: AuditView) {
    setPhase({ kind: "done", view });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFile(file: File) {
    stopTicker();
    setPhase({ kind: "working", file, stage: "uploading", progress: 0 });

    const { promise, abort } = uploadContract(file, {
      onUploadProgress: (ratio) =>
        setPhase((p) => (p.kind === "working" && p.stage === "uploading" ? { ...p, progress: ratio * UPLOAD_SHARE } : p)),
      onUploaded: () => {
        const startedAt = Date.now();
        setPhase((p) => (p.kind === "working" ? { ...p, stage: "reading", progress: UPLOAD_SHARE } : p));
        tickRef.current = setInterval(() => {
          const elapsed = (Date.now() - startedAt) / 1000;
          const progress = UPLOAD_SHARE + (95 - UPLOAD_SHARE) * (1 - Math.exp(-elapsed / 25));
          setPhase((p) => (p.kind === "working" ? { ...p, progress, stage: stageFor(progress) } : p));
        }, 250);
      },
    });
    abortRef.current = abort;

    try {
      const result = await promise;
      stopTicker();
      showResult({ audit: result.audit, fileName: result.fileName, model: result.model, savedId: null, savedAt: null });
      toast.success("Audit kontrak selesai!", { description: "Tinjau temuan klausul dan draf negosiasi di bawah." });
    } catch (error) {
      stopTicker();
      if (isAbortError(error)) return;
      const message = errorMessage(error, "AI gagal mengaudit kontrak, coba lagi");
      // Format/ukuran salah, bukan kontrak, atau kuota habis tidak akan berhasil bila diulang dengan file yang sama.
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
    toast("Audit dibatalkan");
  }

  async function handleSave() {
    if (phase.kind !== "done" || phase.view.savedId) return;
    const { view } = phase;
    setSaving(true);
    try {
      const { audit } = await saveContractAudit(view.fileName, view.audit);
      setSaved((list) => [audit, ...list]);
      setPhase((p) => (p.kind === "done" ? { ...p, view: { ...p.view, savedId: audit.id, savedAt: audit.createdAt } } : p));
      toast.success("Audit disimpan ke riwayat");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menyimpan audit. Silakan coba lagi."));
    } finally {
      setSaving(false);
    }
  }

  async function handleOpen(id: string) {
    setOpeningId(id);
    try {
      const { audit } = await fetchContractAudit(id);
      showResult({ audit: audit.audit, fileName: audit.contractName, model: null, savedId: audit.id, savedAt: audit.createdAt });
    } catch (error) {
      toast.error(errorMessage(error, "Gagal memuat audit. Silakan coba lagi."));
      if (error instanceof ApiError && error.status === 404) setSaved((list) => list.filter((a) => a.id !== id));
    } finally {
      setOpeningId(null);
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeContractAudit(id);
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menghapus audit. Silakan coba lagi."));
      throw error;
    }
    setSaved((list) => list.filter((a) => a.id !== id));
    setPhase((p) => (p.kind === "done" && p.view.savedId === id ? { ...p, view: { ...p.view, savedId: null, savedAt: null } } : p));
    toast.success("Audit dihapus dari riwayat");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="AI Contract Risk Scanner"
        title={phase.kind === "done" ? "Hasil Audit Kontrak" : "Audit Kontrak Kerja Remote"}
        description={
          phase.kind === "done"
            ? "Prioritaskan klausul berisiko tinggi, lalu gunakan draf email untuk bernegosiasi dengan HR."
            : "Unggah kontrak kerja atau offer letter. AI akan memilah klausul berisiko, memberi skor keamanan, dan menyiapkan draf negosiasi."
        }
      />

      <AnimatePresence mode="wait">
        {phase.kind === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-10">
            <div>
              <ContractDropzone onFile={handleFile} />
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {["Deteksi denda sepihak & klaim HKI berlebihan", "Cek jam kerja & timezone dari sisi WIB", "Draf email negosiasi siap kirim"].map((t) => (
                  <p key={t} className="flex items-center gap-2">
                    <CircleCheckBig className="size-4 shrink-0 text-success" aria-hidden /> {t}
                  </p>
                ))}
              </div>
            </div>
            <SavedAudits audits={saved} openingId={openingId} onOpen={handleOpen} onDelete={handleDelete} />
          </motion.div>
        )}

        {phase.kind === "working" && (
          <motion.div key="working" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto max-w-xl">
            <AuditProgress fileName={phase.file.name} fileSize={phase.file.size} stage={phase.stage} progress={phase.progress} onCancel={cancel} />
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
                  ? "Pastikan file berisi teks kontrak yang dapat dibaca (bukan hasil scan buram) lalu coba lagi."
                  : "Silakan periksa file Anda atau coba lagi nanti."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                {phase.retryable && (
                  <Button onClick={() => handleFile(phase.file)}>
                    <RotateCcw data-icon="inline-start" /> Audit Ulang
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
          <motion.div key={`done-${phase.view.fileName}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <AuditResult view={phase.view} saving={saving} onSave={handleSave} onReset={() => setPhase({ kind: "idle" })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
