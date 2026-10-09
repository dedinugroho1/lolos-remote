"use client";

import { ArrowLeft, BadgeCheck, Building2, ChevronDown, ExternalLink, FileText, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FlowSteps } from "@/components/app/flow-steps";
import { MatchResultView } from "@/components/match/match-result-view";
import { FadeIn } from "@/components/motion/fade-in";
import { ApplyDialog } from "@/components/result/apply-dialog";
import { ScoreBadge } from "@/components/score/score-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative } from "@/lib/format";
import { apiFetch, errorMessage } from "@/lib/client/api";
import { clearPendingMatch, usePendingMatch } from "@/lib/client/pending-match";

export function ResultView() {
  const router = useRouter();
  const pending = usePendingMatch();
  const [applyOpen, setApplyOpen] = useState(false);
  const [showJd, setShowJd] = useState(false);
  const leaving = useRef(false);

  // Halaman transient: tanpa hasil sementara → kembali ke /check (guard CV ada di server).
  useEffect(() => {
    if (leaving.current || pending === undefined) return;
    if (!pending) router.replace("/check");
  }, [pending, router]);

  if (!pending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-12 w-[28rem] max-w-full" />
        <div className="grid gap-6 lg:grid-cols-[5fr_7fr]">
          <Skeleton className="h-[520px] rounded-2xl" />
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const { result, jobDescription, jobUrl, analyzedAt } = pending;
  const title = result.job_info.job_title || "Lowongan tanpa judul";
  const company = result.job_info.company_name || "Perusahaan tidak terdeteksi";

  function checkAnother() {
    leaving.current = true;
    clearPendingMatch();
    router.push("/check");
  }

  async function handleApply(values: { jobTitle: string; companyName: string; notes: string }) {
    if (!pending) return;
    try {
      await apiFetch("/api/save-application", {
        json: {
          ...values,
          result: pending.result,
          jobDescription: pending.jobDescription,
          jobUrl: pending.jobUrl,
        },
      });
    } catch (error) {
      toast.error(errorMessage(error, "Lamaran gagal disimpan. Silakan coba lagi."));
      return;
    }
    leaving.current = true;
    clearPendingMatch();
    setApplyOpen(false);
    toast.success("Lamaran berhasil dicatat!", { description: `${values.jobTitle} — ${values.companyName}` });
    router.push("/history");
    router.refresh();
  }

  return (
    <div className="space-y-8 pb-28 sm:pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FlowSteps current={2} />
          <Button variant="ghost" size="sm" onClick={checkAnother} className="text-muted-foreground">
            <ArrowLeft data-icon="inline-start" /> Kembali ke form
          </Button>
        </div>
        <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Hasil Analisis · {formatRelative(analyzedAt)}</p>
            <h1 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">{title}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4" aria-hidden /> {company}
              </span>
              {jobUrl && (
                <a
                  href={jobUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Buka lowongan <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </p>
          </div>
          <ScoreBadge score={result.fit_score} size="lg" />
        </FadeIn>
      </div>

      <MatchResultView result={result} />

      <section className="rounded-2xl border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => setShowJd((v) => !v)}
          aria-expanded={showJd}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-4 text-left text-sm font-bold hover:bg-muted/40"
        >
          <span className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" aria-hidden /> Job Description yang dianalisis
          </span>
          <ChevronDown className={showJd ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} aria-hidden />
        </button>
        {showJd && (
          <pre className="max-h-96 overflow-auto border-t px-6 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {jobDescription}
          </pre>
        )}
      </section>

      {/* Dua tombol keputusan — sticky di mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 p-4 backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-6xl flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button size="xl" variant="outline" onClick={checkAnother} className="sm:min-w-56" aria-label="Buang hasil dan cek lowongan lain">
            <RotateCcw data-icon="inline-start" /> Cek Lowongan Lain
          </Button>
          <Button
            size="xl"
            onClick={() => setApplyOpen(true)}
            className="shadow-xl shadow-primary/25 sm:min-w-56"
            aria-label="Tandai lowongan ini sudah dilamar"
          >
            <BadgeCheck data-icon="inline-start" /> Tandai Sudah Apply
          </Button>
        </div>
        <p className="mt-3 hidden text-center text-xs text-muted-foreground sm:block">
          Hasil ini tidak disimpan kecuali Anda menandainya &ldquo;Sudah Apply&rdquo;.
        </p>
      </div>

      <ApplyDialog
        key={analyzedAt}
        open={applyOpen}
        onOpenChange={setApplyOpen}
        defaultTitle={result.job_info.job_title}
        defaultCompany={result.job_info.company_name}
        onSubmit={handleApply}
      />
    </div>
  );
}
