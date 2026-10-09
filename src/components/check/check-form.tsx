"use client";

import { AnimatePresence } from "framer-motion";
import { ClipboardPaste, Eraser, FileText, Link2, ScanSearch, Sparkles, Tags } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { FlowSteps } from "@/components/app/flow-steps";
import { PageHeader } from "@/components/app/page-header";
import { ScanningOverlay } from "@/components/check/scanning-overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, apiFetch, errorMessage } from "@/lib/client/api";
import { setPendingMatch } from "@/lib/client/pending-match";
import { sampleJobDescription } from "@/lib/dummy/match-result";
import { formatNumber } from "@/lib/format";
import { jobDescriptionSchema, type StoredCvProfile } from "@/lib/schemas/application";
import type { JobMatchResult } from "@/lib/schemas/job-match";
import { cn } from "@/lib/utils";

const MIN = 50;
const MAX = 15_000;

/** Kata kunci yang dideteksi otomatis (PRD Bab 6B). */
const KEYWORDS = [
  "US only", "EU only", "worldwide", "anywhere", "timezone", "UTC", "WIB", "overlap", "contract", "full-time", "part-time",
];

export function CheckForm({ cv }: { cv: StoredCvProfile }) {
  const router = useRouter();
  const [jd, setJd] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const length = jd.trim().length;
  const tooShort = length < MIN;
  const detected = useMemo(
    () => KEYWORDS.filter((k) => new RegExp(`\\b${k.replace(/[-\s]/g, "[\\s-]?")}\\b`, "i").test(jd)),
    [jd],
  );

  function handleChange(value: string) {
    if (value.length > MAX) {
      setJd(value.slice(0, MAX));
      toast.info("Job Description dipotong otomatis ke 15.000 karakter");
      return;
    }
    setJd(value);
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return toast.info("Clipboard Anda kosong");
      handleChange(text);
      textareaRef.current?.focus();
    } catch {
      toast.error("Browser tidak mengizinkan akses clipboard. Tempel manual dengan Ctrl/⌘ + V.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = jobDescriptionSchema.safeParse({ jobDescription: jd, jobUrl: jobUrl.trim() });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue?.path[0] === "jobUrl") setUrlError(issue.message);
      toast.error(issue?.message ?? "Input tidak valid");
      return;
    }
    setUrlError(null);
    setScanning(true);
    try {
      const res = await apiFetch<{ result: JobMatchResult; jobDescription: string }>("/api/check-match", {
        json: { jobDescription: parsed.data.jobDescription },
      });
      setPendingMatch({
        result: res.result,
        jobDescription: res.jobDescription,
        jobUrl: parsed.data.jobUrl || null,
        analyzedAt: new Date().toISOString(),
      });
      router.push("/check/result");
    } catch (error) {
      setScanning(false);
      if (error instanceof ApiError && error.code === "no_cv") {
        toast.info(error.message);
        router.replace("/upload?from=check");
        return;
      }
      toast.error(errorMessage(error, "AI gagal menilai lowongan ini, coba lagi"), {
        description: error instanceof ApiError && error.status === 429 ? "Kuota harian akan direset dalam 24 jam." : undefined,
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <FlowSteps current={1} />
        <PageHeader
          title="Tempel Job Description di Bawah"
          description="Salin seluruh teks lowongan — dari judul sampai info gaji. Semakin lengkap, semakin akurat penilaiannya."
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <form onSubmit={handleSubmit} className="relative rounded-2xl border bg-card p-5 shadow-sm sm:p-6" noValidate>
          <AnimatePresence>{scanning && <ScanningOverlay />}</AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="jd" className="text-sm font-bold">
              Job Description <span className="text-danger">*</span>
            </Label>
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={pasteFromClipboard} disabled={scanning}>
                <ClipboardPaste data-icon="inline-start" /> Tempel
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setJd(sampleJobDescription);
                  toast.success("Contoh JD Northwind Labs dimuat");
                }}
                disabled={scanning}
              >
                <Sparkles data-icon="inline-start" /> Pakai contoh JD
              </Button>
              {jd && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setJd("")} disabled={scanning} aria-label="Kosongkan Job Description">
                  <Eraser />
                </Button>
              )}
            </div>
          </div>

          <Textarea
            ref={textareaRef}
            id="jd"
            value={jd}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={"Contoh:\nSenior Frontend Engineer (Remote)\nCompany: Northwind Labs\n\nRequirements\n- 5+ years of experience with React & TypeScript\n- At least 4 hours overlap with CET\n…"}
            aria-describedby="jd-counter"
            aria-invalid={jd.length > 0 && tooShort}
            disabled={scanning}
            className="mt-3 field-sizing-fixed min-h-[340px] resize-y font-mono text-[13px] leading-relaxed"
          />

          <div id="jd-counter" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className={cn("text-muted-foreground", jd.length > 0 && tooShort && "font-medium text-amber-700 dark:text-amber-300")}>
              {jd.length === 0
                ? `Minimal ${MIN} karakter`
                : tooShort
                  ? `Kurang ${MIN - length} karakter lagi`
                  : "Siap dianalisis ✓"}
            </span>
            <span className={cn("font-mono tabular-nums", length > MAX * 0.9 ? "text-warning" : "text-muted-foreground")}>
              {formatNumber(jd.length)} / {formatNumber(MAX)}
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <Label htmlFor="job-url" className="text-sm font-semibold">
              Link lowongan <span className="font-normal text-muted-foreground">(opsional)</span>
            </Label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="job-url"
                type="url"
                inputMode="url"
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://www.linkedin.com/jobs/view/…"
                aria-invalid={Boolean(urlError)}
                aria-describedby={urlError ? "job-url-error" : undefined}
                disabled={scanning}
                className="pl-10"
              />
            </div>
            {urlError && (
              <p id="job-url-error" className="text-xs font-medium text-danger">
                {urlError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="xl"
            className="mt-6 w-full shadow-xl shadow-primary/20"
            disabled={tooShort || scanning}
            aria-label="Cek kecocokan CV dengan lowongan ini"
          >
            <ScanSearch data-icon="inline-start" />
            {scanning ? "AI sedang menilai..." : "Cek Kecocokan"}
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">CV yang dipakai</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <FileText className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{cv.originalFileName ?? "CV.pdf"}</p>
                <p className="text-xs text-muted-foreground">{cv.profileJson.technical_skills.length} skill teknis</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/upload">Ganti CV</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              <Tags className="size-3.5" aria-hidden /> Kata kunci terdeteksi
            </p>
            {detected.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Belum ada. Kami akan mencari kata seperti <em>US only</em>, <em>worldwide</em>, <em>UTC</em>, atau <em>full-time</em>.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {detected.map((k) => (
                  <li key={k} className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] font-semibold text-secondary-foreground">
                    {k}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Tips hasil akurat</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Sertakan bagian Requirements & Nice to have.</li>
              <li>Jangan lupa info lokasi, zona waktu, dan gaji.</li>
              <li>Hasil tidak disimpan kecuali Anda menandai &ldquo;Sudah Apply&rdquo;.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
