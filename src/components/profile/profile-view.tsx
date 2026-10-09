"use client";

import { ArrowRight, Cookie, Cpu, Download, FileText, FileUp, History, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/page-header";
import { FadeIn } from "@/components/motion/fade-in";
import { DeleteAllDialog } from "@/components/profile/delete-all-dialog";
import { ProfilePreview } from "@/components/profile/profile-preview";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { apiFetch, errorMessage } from "@/lib/client/api";
import { clearPendingMatch } from "@/lib/client/pending-match";
import type { StoredCvProfile } from "@/lib/schemas/application";

export function ProfileView({
  cv,
  applicationCount,
  contractAuditCount = 0,
}: {
  cv: StoredCvProfile | null;
  applicationCount: number;
  contractAuditCount?: number;
}) {
  const router = useRouter();

  function downloadJson() {
    if (!cv) return;
    const blob = new Blob([JSON.stringify(cv.profileJson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lolosremote-profil-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Profil JSON diunduh");
  }

  // DELETE /api/profil-saya: hapus cv_profiles + saved_applications + contract_audits milik sesi, lalu hapus cookie.
  async function deleteAll() {
    try {
      await apiFetch("/api/profil-saya", { method: "DELETE" });
    } catch (error) {
      toast.error(errorMessage(error, "Data gagal dihapus. Silakan coba lagi."));
      throw error;
    }
    clearPendingMatch();
    toast.success("Semua data Anda telah dihapus", { description: "Sesi baru akan dibuat saat Anda kembali." });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profil Saya"
        description="Ringkasan CV yang tersimpan untuk perangkat ini, beserta kontrol penuh atas data Anda."
        actions={
          cv && (
            <>
              <Button variant="outline" onClick={downloadJson} aria-label="Unduh profil sebagai JSON">
                <Download data-icon="inline-start" /> Unduh JSON
              </Button>
              <Button asChild>
                <Link href="/upload">
                  <RefreshCw data-icon="inline-start" /> Perbarui CV
                </Link>
              </Button>
            </>
          )
        }
      />

      {cv ? (
        <>
          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: FileText, label: "File CV", value: cv.originalFileName ?? "CV.pdf", mono: false },
                { icon: Cpu, label: "Dibaca oleh model", value: cv.claudeModel, mono: true },
                { icon: RefreshCw, label: "Terakhir diperbarui", value: formatDateTime(cv.updatedAt), mono: false },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="card-lift rounded-2xl border bg-card p-5 shadow-sm">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Icon className="size-4" aria-hidden /> {label}
                  </p>
                  <p className={mono ? "mt-2 truncate font-mono text-sm font-semibold" : "mt-2 truncate text-sm font-semibold"}>{value}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <ProfilePreview profile={cv.profileJson} />
        </>
      ) : (
        <FadeIn>
          <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center shadow-sm">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <FileUp className="size-7" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-bold">Belum ada CV tersimpan</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Unggah CV Anda sekali, lalu cek kecocokan dengan lowongan remote sebanyak yang Anda mau.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/upload">
                Unggah CV Anda <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <FadeIn>
          <section className="h-full rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Cookie className="size-4 text-primary" aria-hidden /> Sesi Anonim Anda
            </h2>
            <dl className="mt-4 divide-y text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Nama cookie</dt>
                <dd className="font-mono text-xs font-semibold">lolosremote_session</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Masa berlaku</dt>
                <dd className="font-semibold">30 hari</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Profil CV</dt>
                <dd className="font-mono font-semibold">{cv ? 1 : 0}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Lamaran tercatat</dt>
                <dd className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{applicationCount}</span>
                  <Link href="/history" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    <History className="size-3.5" aria-hidden /> Lihat
                  </Link>
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">Audit kontrak tersimpan</dt>
                <dd className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{contractAuditCount}</span>
                  <Link href="/kontrak" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    <History className="size-3.5" aria-hidden /> Lihat
                  </Link>
                </dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              Data hanya bisa diakses dari browser ini. Jika cookie terhapus, Anda akan dianggap pengunjung baru.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.06}>
          <section aria-labelledby="danger-title" className="h-full rounded-2xl border border-danger/30 bg-card p-6 shadow-sm">
            <h2 id="danger-title" className="text-base font-bold text-danger">
              Zona Berbahaya
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Hapus profil CV, seluruh riwayat lamaran, riwayat audit kontrak, dan cookie sesi Anda. Tindakan ini permanen dan memerlukan konfirmasi
              dua langkah.
            </p>
            <div className="mt-6">
              <DeleteAllDialog
                applicationCount={applicationCount}
                contractAuditCount={contractAuditCount}
                hasCv={Boolean(cv)}
                onConfirm={deleteAll}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Baca selengkapnya di{" "}
              <Link href="/kebijakan-privasi#hak-hapus" className="font-semibold text-primary hover:underline">
                Kebijakan Privasi
              </Link>
              .
            </p>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
