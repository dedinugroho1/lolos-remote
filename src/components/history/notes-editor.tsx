"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { NOTES_MAX } from "@/lib/schemas/application";
import { cn } from "@/lib/utils";

export function NotesEditor({ initial, onSave }: { initial: string; onSave: (notes: string) => Promise<void> }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dirty = value !== initial;
  const tooLong = value.length > NOTES_MAX;

  async function save() {
    if (!dirty || tooLong) return;
    setSaving(true);
    try {
      await onSave(value);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
        }}
        aria-label="Catatan lamaran"
        aria-invalid={tooLong}
        placeholder="Tulis catatan: nama recruiter, jadwal interview, gaji yang ditawarkan, pelajaran yang didapat…"
        className="field-sizing-fixed min-h-40 resize-y leading-relaxed"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={cn("font-mono text-xs text-muted-foreground", tooLong && "font-semibold text-danger")}>
          {formatNumber(value.length)}/{formatNumber(NOTES_MAX)}
          {tooLong && " · terlalu panjang"}
        </span>
        <div className="flex gap-2">
          {dirty && (
            <Button variant="ghost" size="sm" onClick={() => setValue(initial)} disabled={saving}>
              Batal
            </Button>
          )}
          <Button size="sm" onClick={save} disabled={!dirty || tooLong || saving} aria-label="Simpan catatan">
            {saving ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <Save data-icon="inline-start" />}
            Simpan catatan
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Tip: tekan <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">⌘/Ctrl</kbd> +{" "}
        <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">Enter</kbd> untuk menyimpan.
      </p>
    </div>
  );
}
