"use client";

import { BadgeCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { NOTES_MAX, saveApplicationSchema } from "@/lib/schemas/application";
import { cn } from "@/lib/utils";

type Values = { jobTitle: string; companyName: string; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

export function ApplyDialog({
  open,
  onOpenChange,
  defaultTitle,
  defaultCompany,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTitle: string;
  defaultCompany: string;
  onSubmit: (values: Values) => Promise<void>;
}) {
  const [values, setValues] = useState<Values>({ jobTitle: defaultTitle, companyName: defaultCompany, notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = saveApplicationSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  }

  const autoDetected = Boolean(defaultTitle && defaultCompany);

  return (
    <Dialog open={open} onOpenChange={(o) => !saving && onOpenChange(o)}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate className="grid gap-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <BadgeCheck className="size-5 text-success" aria-hidden /> Tandai Sudah Apply
            </DialogTitle>
            <DialogDescription>
              {autoDetected
                ? "Judul dan perusahaan terisi otomatis dari hasil AI — silakan koreksi jika perlu."
                : "AI tidak berhasil mendeteksi judul atau perusahaan. Mohon isi secara manual."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <Label htmlFor="apply-title">
              Judul lowongan <span className="text-danger">*</span>
            </Label>
            <Input
              id="apply-title"
              value={values.jobTitle}
              onChange={set("jobTitle")}
              placeholder="Contoh: Senior Frontend Engineer"
              aria-invalid={Boolean(errors.jobTitle)}
              autoFocus={!values.jobTitle}
            />
            {errors.jobTitle && <p className="text-xs font-medium text-danger">{errors.jobTitle}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apply-company">
              Nama perusahaan <span className="text-danger">*</span>
            </Label>
            <Input
              id="apply-company"
              value={values.companyName}
              onChange={set("companyName")}
              placeholder="Contoh: Northwind Labs"
              aria-invalid={Boolean(errors.companyName)}
            />
            {errors.companyName && <p className="text-xs font-medium text-danger">{errors.companyName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="apply-notes">
              Catatan <span className="font-normal text-muted-foreground">(opsional)</span>
            </Label>
            <Textarea
              id="apply-notes"
              value={values.notes}
              onChange={set("notes")}
              placeholder="Misalnya: apply via portal Workable, recruiter bernama Sofie, follow-up minggu depan."
              className="min-h-24"
              aria-invalid={Boolean(errors.notes)}
            />
            <div className="flex justify-between text-xs">
              <span className="font-medium text-danger">{errors.notes}</span>
              <span className={cn("font-mono text-muted-foreground", values.notes.length > NOTES_MAX && "text-danger")}>
                {formatNumber(values.notes.length)}/{formatNumber(NOTES_MAX)}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <BadgeCheck data-icon="inline-start" />}
              {saving ? "Menyimpan..." : "Simpan ke Riwayat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
