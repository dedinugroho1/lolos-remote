"use client";

import { ArrowLeft, Building2, CalendarDays, ChevronDown, ExternalLink, FileText, History, NotebookPen, SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteApplicationButton } from "@/components/history/delete-application-button";
import { NotesEditor } from "@/components/history/notes-editor";
import { StatusBadge } from "@/components/history/status-badge";
import { StatusControl } from "@/components/history/status-control";
import { MatchResultView } from "@/components/match/match-result-view";
import { FadeIn } from "@/components/motion/fade-in";
import { ScoreBadge } from "@/components/score/score-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatRelative } from "@/lib/format";
import { apiFetch, errorMessage } from "@/lib/client/api";
import type { Application, ApplicationStatus } from "@/lib/schemas/application";
import { statusMeta } from "@/lib/status";

export function ApplicationDetail({ application }: { application: Application }) {
  const router = useRouter();
  const [showJd, setShowJd] = useState(false);
  // Status lokal agar perubahan langsung terasa (optimistic), disinkronkan ke server via PATCH.
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const app = { ...application, status };

  const snapshot = app.matchResultJson;

  async function changeStatus(next: ApplicationStatus) {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    try {
      await apiFetch(`/api/applications/${app.id}`, { method: "PATCH", json: { status: next } });
      toast.success(`Status diperbarui ke ${statusMeta[next].label}`);
      router.refresh();
    } catch (error) {
      setStatus(previous);
      toast.error(errorMessage(error, "Status gagal diperbarui."));
    }
  }

  async function saveNotes(notes: string) {
    try {
      await apiFetch(`/api/applications/${app.id}`, { method: "PATCH", json: { notes: notes.trim() ? notes : null } });
      toast.success("Catatan disimpan");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Catatan gagal disimpan."));
    }
  }

  async function remove() {
    try {
      await apiFetch(`/api/applications/${app.id}`, { method: "DELETE" });
    } catch (error) {
      toast.error(errorMessage(error, "Lamaran gagal dihapus."));
      throw error;
    }
    toast.success("Lamaran dihapus dari riwayat");
    router.push("/history");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden /> Riwayat Lamaran
        </Link>
        <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={app.status} />
              <span className="text-xs text-muted-foreground">Diperbarui {formatRelative(app.updatedAt)}</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{app.jobTitle}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4" aria-hidden /> {app.companyName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden /> Apply {formatDateTime(app.appliedAt)}
              </span>
              {snapshot.job_url && (
                <a
                  href={snapshot.job_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  Buka lowongan <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={app.fitScore} size="lg" />
            <DeleteApplicationButton label={`${app.jobTitle} — ${app.companyName}`} onConfirm={remove} />
          </div>
        </FadeIn>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <FadeIn>
          <section aria-labelledby="status-title" className="h-full rounded-2xl border bg-card p-6 shadow-sm">
            <h2 id="status-title" className="flex items-center gap-2 text-base font-bold">
              <History className="size-4 text-primary" aria-hidden /> Status Lamaran
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Klik tahap atau pilih dari daftar untuk memperbarui.</p>
            <div className="mt-5">
              <StatusControl status={app.status} onChange={changeStatus} />
            </div>
          </section>
        </FadeIn>
        <FadeIn delay={0.06}>
          <section aria-labelledby="notes-title" className="h-full rounded-2xl border bg-card p-6 shadow-sm">
            <h2 id="notes-title" className="flex items-center gap-2 text-base font-bold">
              <NotebookPen className="size-4 text-primary" aria-hidden /> Catatan
            </h2>
            <div className="mt-4">
              <NotesEditor key={app.notes ?? ""} initial={app.notes ?? ""} onSave={saveNotes} />
            </div>
          </section>
        </FadeIn>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Snapshot Hasil Analisis</h2>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <MatchResultView result={snapshot} />
      </div>

      {snapshot.job_description && (
        <section className="rounded-2xl border bg-card shadow-sm">
          <button
            type="button"
            onClick={() => setShowJd((v) => !v)}
            aria-expanded={showJd}
            className="flex w-full items-center justify-between gap-3 rounded-2xl px-6 py-4 text-left text-sm font-bold hover:bg-muted/40"
          >
            <span className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" aria-hidden /> Job Description saat apply
            </span>
            <ChevronDown className={showJd ? "size-4 rotate-180 transition-transform" : "size-4 transition-transform"} aria-hidden />
          </button>
          {showJd && (
            <pre className="max-h-96 overflow-auto border-t px-6 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {snapshot.job_description}
            </pre>
          )}
        </section>
      )}
    </div>
  );
}

export function ApplicationNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
      <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <SearchX className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-xl font-bold">Lamaran tidak ditemukan</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Lamaran ini mungkin sudah dihapus, atau bukan milik sesi perangkat Anda.
      </p>
      <Button asChild className="mt-6">
        <Link href="/history">
          <ArrowLeft data-icon="inline-start" /> Kembali ke Riwayat
        </Link>
      </Button>
    </div>
  );
}
