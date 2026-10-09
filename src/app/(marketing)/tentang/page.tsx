import {
  ArrowRight,
  Brain,
  Database,
  FileJson,
  FileUp,
  Fingerprint,
  HeartHandshake,
  Lock,
  Scale,
  Target,
  Trash2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { breakdownCategories } from "@/lib/score";

export const metadata: Metadata = {
  title: "Tentang LolosRemote",
  description:
    "Misi LolosRemote: membantu pencari kerja remote Indonesia berhenti membuang waktu pada lowongan yang sejak awal tidak cocok. Pelajari cara kerja AI dan komitmen privasi kami.",
  alternates: { canonical: "/tentang" },
};

const pipeline = [
  {
    icon: FileUp,
    title: "1. Baca CV",
    text: "PDF dikirim langsung ke Claude sebagai dokumen. Tidak ada parser pihak ketiga — AI membaca tata letak, tabel, dan kolom apa adanya.",
  },
  {
    icon: FileJson,
    title: "2. Susun profil terstruktur",
    text: "Hasilnya divalidasi dengan skema ketat (ringkasan, senioritas, skill, pengalaman, bahasa, domain). Jika tidak valid, sistem menolak dan meminta Anda mencoba lagi.",
  },
  {
    icon: Brain,
    title: "3. Cocokkan dengan lowongan",
    text: "Profil JSON + teks Job Description dikirim ke Claude dengan instruksi penilaian 5 kategori berbobot tetap dan deteksi syarat kritis.",
  },
  {
    icon: Scale,
    title: "4. Sajikan secara netral",
    text: "Skor, info kritis, matched vs gaps, dan peringatan ditampilkan apa adanya — tanpa menyuruh Anda apply atau skip.",
  },
];

const privacy = [
  { icon: Lock, title: "PDF tidak disimpan", text: "File asli dibuang setelah dibaca. Hanya ringkasan JSON yang kami simpan." },
  { icon: Fingerprint, title: "Anonim sejak awal", text: "Tanpa email, nama akun, atau nomor HP. Identitas Anda hanya ID acak di cookie." },
  { icon: Database, title: "Terisolasi per sesi", text: "Setiap query database wajib difilter ID sesi Anda. Tidak ada yang bisa mengintip data orang lain." },
  { icon: Trash2, title: "Hak hapus penuh", text: "Satu tombol untuk menghapus profil, riwayat lamaran, dan cookie — permanen." },
];

const techFaq = [
  {
    q: "Kenapa memakai Claude, bukan model lain?",
    a: "Claude mampu membaca PDF secara native dan konsisten mengikuti format output terstruktur. Ini penting agar profil CV dan skor selalu valid terhadap skema kami.",
  },
  {
    q: "Apa itu model switcher?",
    a: "Model AI diatur lewat konfigurasi server (CLAUDE_MODEL). Default-nya Claude Haiku 5.5 yang cepat dan hemat; jika sedang padat, sistem beralih ke model cadangan.",
  },
  {
    q: "Teknologi apa yang menjalankan LolosRemote?",
    a: "Next.js 15 (App Router) dengan TypeScript, Tailwind CSS, Drizzle ORM, dan database Neon PostgreSQL Serverless di region Asia Tenggara.",
  },
  {
    q: "Bagaimana mencegah AI 'mengarang' data?",
    a: "Instruksi AI mewajibkan menulis \"Tidak disebutkan\" jika informasi tidak ada di Job Description, dan setiap output divalidasi skema sebelum ditampilkan.",
  },
];

export default function TentangPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang LolosRemote"
        title={
          <>
            Kami ingin Anda melamar <span className="text-gradient-brand">lebih sedikit</span>, tapi lebih tepat.
          </>
        }
        description="LolosRemote lahir dari pengalaman pribadi: puluhan lamaran remote terkirim, banyak yang ternyata sejak awal mustahil diterima karena syarat lokasi atau zona waktu yang tersembunyi."
      />

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <FadeIn>
            <div className="h-full rounded-2xl border bg-card p-7 shadow-sm">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Target className="size-5" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">Misi kami</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Memberi setiap pencari kerja remote di Indonesia — dari fresh graduate sampai senior — cara cepat dan jujur
                untuk menjawab satu pertanyaan sebelum menghabiskan waktu menulis cover letter:{" "}
                <strong className="text-foreground">&ldquo;Apakah saya cocok dengan lowongan ini?&rdquo;</strong>
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="h-full rounded-2xl border bg-card p-7 shadow-sm">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <HeartHandshake className="size-5" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">Cerita di baliknya</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                <p>
                  Di grup-grup pencari kerja remote, keluhan yang sama terus muncul: &ldquo;sudah apply 50 lowongan, tidak ada
                  balasan.&rdquo; Setelah ditelusuri, sebagian besar lowongan itu mensyaratkan domisili AS, overlap jam yang
                  tidak realistis dari WIB, atau skill wajib yang belum dimiliki.
                </p>
                <p>
                  Kami membangun LolosRemote sebagai saringan pertama yang gratis, cepat, dan tidak menghakimi — plus buku
                  catatan sederhana agar Anda tidak lagi kehilangan jejak lamaran.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-card/40 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <FadeIn className="max-w-2xl">
            <p className="text-sm font-bold tracking-wide text-primary uppercase">Cara kerja AI</p>
            <h2 className="mt-3 text-3xl font-extrabold">Pipeline dua tahap yang transparan</h2>
            <p className="mt-3 text-muted-foreground">
              Tidak ada kotak hitam. Berikut yang terjadi sejak Anda mengunggah CV hingga skor muncul.
            </p>
          </FadeIn>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
            {pipeline.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <div className="card-lift h-full rounded-2xl border bg-card p-6 shadow-sm">
                  <Icon className="size-6 text-primary" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn className="mt-10">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="border-b px-6 py-4">
                <h3 className="font-bold">Bobot skor yang dikunci</h3>
                <p className="text-sm text-muted-foreground">Total maksimal 100, dibulatkan ke bilangan bulat.</p>
              </div>
              <ul className="divide-y">
                {breakdownCategories.map((c) => (
                  <li key={c.key} className="flex items-center gap-4 px-6 py-3.5">
                    <span className="w-12 shrink-0 font-mono text-lg font-bold text-primary">{c.max}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="text-xs text-muted-foreground">{c.hint}</p>
                    </div>
                    <div className="hidden h-2 w-40 overflow-hidden rounded-full bg-muted sm:block">
                      <div className="bg-gradient-brand h-full rounded-full" style={{ width: `${(c.max / 40) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <FadeIn className="max-w-2xl">
          <p className="text-sm font-bold tracking-wide text-primary uppercase">Komitmen privasi</p>
          <h2 className="mt-3 text-3xl font-extrabold">CV Anda adalah milik Anda</h2>
        </FadeIn>
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {privacy.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card-lift h-full rounded-2xl border bg-card p-6 shadow-sm">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeIn className="mt-6">
          <Link href="/kebijakan-privasi" className="text-sm font-semibold text-primary hover:underline">
            Baca Kebijakan Privasi lengkap →
          </Link>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <h2 className="text-2xl font-extrabold">FAQ Teknologi</h2>
          <Accordion type="single" collapsible className="mt-5 rounded-2xl border bg-card px-5 shadow-sm">
            {techFaq.map((f, i) => (
              <AccordionItem key={f.q} value={`tech-${i}`}>
                <AccordionTrigger className="py-4 text-left text-[0.95rem] font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-4 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
        <FadeIn className="mt-10 text-center">
          <Button asChild size="xl" className="shadow-xl shadow-primary/20">
            <Link href="/upload">
              Mulai Cek Sekarang <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </FadeIn>
      </section>
    </>
  );
}
