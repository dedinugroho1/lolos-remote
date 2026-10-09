"use client";

import { BookmarkCheck, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { safetyMeta } from "@/lib/contract/meta";
import { formatDate, formatRelative } from "@/lib/format";
import type { ContractAuditSummary } from "@/lib/schemas/contract-audit";
import { scoreColor } from "@/lib/score";
import { cn } from "@/lib/utils";

function DeleteAuditButton({ name, onConfirm }: { name: string; onConfirm: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Hapus audit ${name}`} className="text-muted-foreground hover:text-danger">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus audit ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Hasil audit <strong className="text-foreground">{name}</strong> akan dihapus permanen dari riwayat Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Batal</AlertDialogCancel>
          <Button
            variant="danger"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
                setOpen(false);
              } catch {
                // Pesan error sudah ditampilkan pemanggil; biarkan dialog tetap terbuka.
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Trash2 data-icon="inline-start" />}
            Ya, hapus
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SavedAudits({
  audits,
  openingId,
  onOpen,
  onDelete,
}: {
  audits: ContractAuditSummary[];
  openingId: string | null;
  onOpen: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <section aria-labelledby="saved-audits-title" className="space-y-4">
      <div className="flex items-center gap-2">
        <BookmarkCheck className="size-5 text-primary" aria-hidden />
        <h2 id="saved-audits-title" className="text-lg font-bold">
          Riwayat Audit Tersimpan
        </h2>
        <span className="font-mono text-sm text-muted-foreground">({audits.length})</span>
      </div>

      {audits.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Belum ada audit tersimpan. Klik tombol <strong>Simpan ke Riwayat</strong> pada hasil audit untuk menyimpannya di sini.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {audits.map((a) => {
            const meta = safetyMeta(a.safetyScore);
            const opening = openingId === a.id;
            return (
              <li key={a.id} className="relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm">
                <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: scoreColor(a.safetyScore) }} />
                <button
                  type="button"
                  onClick={() => onOpen(a.id)}
                  disabled={openingId !== null}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-70"
                  aria-label={`Lihat hasil audit ${a.contractName}`}
                >
                  <span className={cn("inline-flex size-12 shrink-0 flex-col items-center justify-center rounded-xl border font-mono", meta.soft, meta.border, meta.text)}>
                    <span className="text-lg leading-none font-bold">{a.safetyScore}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold transition-colors group-hover:text-primary">{a.contractName}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      <span className={cn("font-semibold", meta.text)}>{meta.label}</span> · 🔴 {a.redFlagsCount} red flag ·{" "}
                      <time dateTime={a.createdAt} title={formatDate(a.createdAt)}>
                        {formatRelative(a.createdAt)}
                      </time>
                    </span>
                  </span>
                  {opening ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-label="Memuat" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                  )}
                </button>
                <DeleteAuditButton name={a.contractName} onConfirm={() => onDelete(a.id)} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
