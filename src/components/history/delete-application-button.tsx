"use client";

import { Loader2, Trash2 } from "lucide-react";
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

export function DeleteApplicationButton({ label, onConfirm }: { label: string; onConfirm: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" aria-label="Hapus lamaran ini">
          <Trash2 data-icon="inline-start" /> Hapus Lamaran
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus lamaran ini?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong className="text-foreground">{label}</strong> beserta snapshot hasil analisis dan catatannya akan dihapus
            permanen dari riwayat Anda. Tindakan ini tidak dapat dibatalkan.
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
