"use client";

import { Bookmark, BookmarkCheck, FileSignature, Info, Loader2, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { ExecutiveSummaryCard } from "@/components/contract/executive-summary-card";
import { FindingsSection } from "@/components/contract/findings-section";
import { NegotiationDraftCard } from "@/components/contract/negotiation-draft-card";
import { SafetyScoreCard } from "@/components/contract/safety-score-card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { countFindings, type ContractAudit } from "@/lib/schemas/contract-audit";

export type AuditView = {
  audit: ContractAudit;
  fileName: string;
  model: string | null;
  savedId: string | null;
  savedAt: string | null;
};

export function AuditResult({
  view,
  saving,
  onSave,
  onReset,
}: {
  view: AuditView;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  const { audit } = view;
  const counts = useMemo(() => countFindings(audit.findings), [audit.findings]);
  const saved = view.savedId !== null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <FileSignature className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{view.fileName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {saved && view.savedAt ? (
                <>Disimpan {formatDateTime(view.savedAt)}</>
              ) : (
                <>
                  Diaudit oleh <span className="font-mono">{view.model ?? "Claude"}</span> · belum disimpan
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw data-icon="inline-start" /> Audit Kontrak Lain
          </Button>
          <Button
            onClick={onSave}
            disabled={saved || saving}
            variant={saved ? "success" : "default"}
            aria-label={saved ? "Audit sudah tersimpan di riwayat" : "Simpan hasil audit ke riwayat"}
          >
            {saving ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : saved ? (
              <BookmarkCheck data-icon="inline-start" />
            ) : (
              <Bookmark data-icon="inline-start" />
            )}
            {saved ? "Tersimpan" : "Simpan ke Riwayat"}
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <SafetyScoreCard score={audit.safety_score} counts={counts} />
        <ExecutiveSummaryCard audit={audit} />
      </div>

      <FindingsSection findings={audit.findings} counts={counts} />

      <NegotiationDraftCard draft={audit.negotiation_draft} />

      <p className="flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        Hasil audit dibuat oleh AI untuk membantu Anda memahami kontrak dan bersifat informatif — bukan nasihat hukum. Untuk kontrak bernilai
        besar atau klausul yang kompleks, pertimbangkan konsultasi dengan konsultan hukum ketenagakerjaan.
      </p>
    </div>
  );
}
