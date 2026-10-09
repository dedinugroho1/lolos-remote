"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, FilterX, Gauge, PartyPopper, Plus, Search, Users, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ApplicationCard } from "@/components/history/application-card";
import { EmptyIllustration } from "@/components/history/empty-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applicationStatusEnum, type Application, type ApplicationStatus } from "@/lib/schemas/application";
import { getScoreTier, scoreTierMeta } from "@/lib/score";
import { statusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "oldest" | "score";

export function HistoryView({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = applications.filter(
      (a) =>
        (status === "all" || a.status === status) &&
        (!q || a.jobTitle.toLowerCase().includes(q) || a.companyName.toLowerCase().includes(q)),
    );
    return [...list].sort((a, b) => {
      if (sort === "score") return b.fitScore - a.fitScore;
      const diff = new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [applications, query, status, sort]);

  const stats = useMemo(() => {
    const avg = applications.length ? Math.round(applications.reduce((n, a) => n + a.fitScore, 0) / applications.length) : 0;
    return {
      total: applications.length,
      interview: applications.filter((a) => a.status === "interview").length,
      offer: applications.filter((a) => a.status === "offer").length,
      avg,
    };
  }, [applications]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(applicationStatusEnum.map((s) => [s, 0])) as Record<ApplicationStatus, number>;
    applications.forEach((a) => (c[a.status] += 1));
    return c;
  }, [applications]);

  const hasFilter = query !== "" || status !== "all";
  const resetFilters = () => {
    setQuery("");
    setStatus("all");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Application Tracker"
        title="Riwayat Lamaran Anda"
        description="Semua lowongan yang Anda tandai “Sudah Apply”, lengkap dengan skor dan status terbarunya."
        actions={
          <Button asChild>
            <Link href="/check">
              <Plus data-icon="inline-start" /> Cek Lowongan Baru
            </Link>
          </Button>
        }
      />

      {applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center shadow-sm"
        >
          <EmptyIllustration className="w-52" />
          <h2 className="mt-6 text-xl font-bold">Belum ada lamaran yang tercatat — yuk cek lowongan pertamamu.</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Setelah mengecek kecocokan, tekan &ldquo;Tandai Sudah Apply&rdquo; agar lamaran tersimpan di sini dan bisa Anda
            pantau statusnya.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/check">
                Cek Lowongan Pertama <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total lamaran", value: stats.total, icon: BriefcaseBusiness, tone: "bg-primary/10 text-primary" },
              { label: "Tahap interview", value: stats.interview, icon: Users, tone: "bg-sky-500/10 text-sky-600 dark:text-sky-300" },
              { label: "Offer diterima", value: stats.offer, icon: PartyPopper, tone: "bg-success/10 text-success" },
              {
                label: "Rata-rata fit score",
                value: stats.avg,
                icon: Gauge,
                tone: cn(scoreTierMeta[getScoreTier(stats.avg)].soft, scoreTierMeta[getScoreTier(stats.avg)].text),
              },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="card-lift rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                  <span className={cn("inline-flex size-8 items-center justify-center rounded-lg", tone)}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                </div>
                <dd className="mt-2 font-mono text-3xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul lowongan atau perusahaan…"
                aria-label="Cari lamaran"
                className="pl-10"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Hapus pencarian"
                  onClick={() => setQuery("")}
                  className="absolute top-1/2 right-1 -translate-y-1/2"
                >
                  <X />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 md:flex">
              <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus | "all")}>
                <SelectTrigger aria-label="Filter status" className="w-full md:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status ({applications.length})</SelectItem>
                  {applicationStatusEnum.map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusMeta[s].label} ({counts[s]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger aria-label="Urutkan" className="w-full md:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="score">Skor tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground" aria-live="polite">
            <span>
              Menampilkan <span className="font-mono font-semibold text-foreground">{filtered.length}</span> dari{" "}
              <span className="font-mono">{applications.length}</span> lamaran
            </span>
            {hasFilter && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <FilterX data-icon="inline-start" /> Reset filter
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
              <EmptyIllustration className="w-40 opacity-80" />
              <p className="mt-4 font-semibold">Tidak ada lamaran yang cocok dengan filter Anda</p>
              <p className="mt-1 text-sm text-muted-foreground">Coba kata kunci lain atau ubah filter status.</p>
              <Button variant="outline" className="mt-5" onClick={resetFilters}>
                <FilterX data-icon="inline-start" /> Reset filter
              </Button>
            </div>
          ) : (
            <motion.ul layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((app, i) => (
                  <motion.li
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.3) } }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <ApplicationCard app={app} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </>
      )}
    </div>
  );
}
