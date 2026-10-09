"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONFIRM_WORD = "HAPUS";

/** Konfirmasi ganda sebelum `DELETE /api/profil-saya` (PRD Bab 6E). */
export function DeleteAllDialog({
  applicationCount,
  contractAuditCount = 0,
  hasCv,
  onConfirm,
}: {
  applicationCount: number;
  contractAuditCount?: number;
  hasCv: boolean;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);

  function handleOpenChange(o: boolean) {
    if (busy) return;
    setOpen(o);
    if (!o) {
      setStep(1);
      setTyped("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="danger" size="lg" aria-label="Hapus semua data saya">
          <Trash2 data-icon="inline-start" /> Hapus Semua Data Saya
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className={step === 1 ? "text-danger" : ""}>Langkah {step} dari 2</span>
          <span className="flex gap-1" aria-hidden>
            <span className="h-1 w-6 rounded-full bg-danger" />
            <span className={step === 2 ? "h-1 w-6 rounded-full bg-danger" : "h-1 w-6 rounded-full bg-muted"} />
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="grid gap-5">
              <DialogHeader>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                  <ShieldAlert className="size-6" aria-hidden />
                </span>
                <DialogTitle className="text-xl font-bold">Hapus semua data Anda?</DialogTitle>
                <DialogDescription>Data berikut akan dihapus permanen dan tidak dapat dipulihkan:</DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 rounded-xl border border-danger/20 bg-danger/[0.04] p-4 text-sm">
                <li className="flex justify-between">
                  <span>Profil CV terstruktur</span>
                  <span className="font-mono font-semibold">{hasCv ? "1" : "0"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Riwayat lamaran</span>
                  <span className="font-mono font-semibold">{applicationCount}</span>
                </li>
                <li className="flex justify-between">
                  <span>Riwayat audit kontrak</span>
                  <span className="font-mono font-semibold">{contractAuditCount}</span>
                </li>
                <li className="flex justify-between">
                  <span>Cookie sesi <code className="font-mono text-xs">lolosremote_session</code></span>
                  <span className="font-mono font-semibold">1</span>
                </li>
              </ul>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  Batal
                </Button>
                <Button variant="danger" onClick={() => setStep(2)}>
                  Lanjutkan
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.form
              key="s2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="grid gap-5"
              onSubmit={async (e) => {
                e.preventDefault();
                if (typed !== CONFIRM_WORD) return;
                setBusy(true);
                try {
                  await onConfirm();
                  setOpen(false);
                } catch {
                  // Pesan error sudah ditampilkan pemanggil; dialog tetap terbuka untuk coba lagi.
                } finally {
                  setBusy(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Konfirmasi terakhir</DialogTitle>
                <DialogDescription>
                  Ketik <strong className="font-mono text-danger">{CONFIRM_WORD}</strong> untuk menghapus semua data secara permanen.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="confirm-delete" className="sr-only">
                  Ketik {CONFIRM_WORD}
                </Label>
                <Input
                  id="confirm-delete"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value.toUpperCase())}
                  placeholder={CONFIRM_WORD}
                  autoComplete="off"
                  autoFocus
                  className="h-12 text-center font-mono text-lg tracking-[0.3em]"
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={busy}>
                  Kembali
                </Button>
                <Button type="submit" variant="danger" disabled={typed !== CONFIRM_WORD || busy}>
                  {busy ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Trash2 data-icon="inline-start" />}
                  Hapus Permanen
                </Button>
              </DialogFooter>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
