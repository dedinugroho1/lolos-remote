"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { ContractAudit } from "@/lib/schemas/contract-audit";

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Izin clipboard ditolak (iframe, non-HTTPS, dsb.) — lanjut ke fallback di bawah.
  }
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(el);
  if (!ok) throw new Error("copy_failed");
}

export function NegotiationDraftCard({ draft }: { draft: ContractAudit["negotiation_draft"] }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function handleCopy() {
    try {
      await copyText(`Subject: ${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      toast.success("Draf email disalin ke clipboard");
    } catch {
      toast.error("Gagal menyalin. Silakan blok teks lalu salin manual.");
    }
  }

  return (
    <section aria-labelledby="negotiation-title" className="overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b bg-primary/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="negotiation-title" className="font-bold">
              Draf Rekomendasi Negosiasi
            </h2>
            <p className="text-xs text-muted-foreground">Email profesional (Bahasa Inggris) untuk HR — sesuaikan nama & detail sebelum dikirim.</p>
          </div>
        </div>
        <Button onClick={handleCopy} variant={copied ? "success" : "default"} className="shrink-0" aria-live="polite">
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? "Tersalin!" : "Copy to Clipboard"}
        </Button>
      </div>
      <div className="space-y-3 px-5 py-5 sm:px-6">
        <p className="text-sm">
          <span className="font-semibold text-muted-foreground">Subject: </span>
          <span className="font-semibold">{draft.subject}</span>
        </p>
        <div lang="en" className="max-h-[28rem] overflow-y-auto rounded-xl border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {draft.body}
        </div>
      </div>
    </section>
  );
}
