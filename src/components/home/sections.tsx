import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  FileSearch,
  FileText,
  FileUp,
  Globe2,
  History,
  ListChecks,
  Lock,
  Quote,
  Scale,
  SearchX,
  Sparkles,
  Star,
  TimerOff,
  Trash2,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { ScoreDemo } from "@/components/home/score-demo";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description?: string }) {
  return (
    <FadeIn className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-bold tracking-wide text-primary uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </FadeIn>
  );
}

const companies = ["Northwind Labs", "PayFlow Inc", "Kreativa Studio", "Orbit Health", "Kopi Remotes", "Nusantara Cloud"];

export function CompanyStrip() {
  return (
    <section aria-label="Contoh perusahaan yang dicek pengguna" className="border-y bg-card/50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Lowongan dari perusahaan remote yang sering dicek pengguna kami
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {companies.map((c) => (
            <li key={c} className="font-heading text-lg font-bold text-muted-foreground/60 transition-colors hover:text-foreground">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const problems = [
  { icon: SearchX, title: "Syarat tersembunyi", text: "\"US Only\" atau \"EU residents\" baru ketahuan di paragraf terakhir — setelah Anda menulis cover letter." },
  { icon: TimerOff, title: "30-60 menit terbuang", text: "Membaca ulang CV vs Job Description berkali-kali hanya untuk menjawab: \"saya cocok nggak, sih?\"" },
  { icon: Clock3, title: "Zona waktu bentrok", text: "Overlap 6 jam dengan PST berarti rapat jam 2 pagi WIB. Lebih baik tahu sebelum melamar." },
  { icon: FileText, title: "Riwayat tercecer", text: "Lamaran tersebar di tab browser, spreadsheet, dan catatan HP — sampai lupa sudah apply ke mana saja." },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Masalahnya"
        title="Melamar kerja remote itu melelahkan kalau tanpa saringan"
        description="Banyak lamaran gagal bukan karena Anda kurang mampu, tapi karena sejak awal lowongannya memang tidak bisa Anda lamar."
      />
      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map(({ icon: Icon, title, text }) => (
          <StaggerItem key={title}>
            <div className="card-lift h-full rounded-2xl border bg-card p-6 shadow-sm">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

const steps = [
  {
    icon: FileUp,
    stage: "Tahap 1",
    title: "Unggah CV sekali saja",
    text: "Seret file PDF (maks 5MB). AI membaca CV Anda dan menyusunnya jadi profil terstruktur: ringkasan, skill, pengalaman, bahasa, dan senioritas.",
    meta: "< 30 detik",
  },
  {
    icon: FileSearch,
    stage: "Tahap 2",
    title: "Tempel Job Description, klik cek",
    text: "Salin teks lowongan dari LinkedIn, Upwork, atau WeWorkRemotely. AI mencocokkannya dengan profil Anda dan memberi skor 0-100 beserta alasannya.",
    meta: "< 15 detik",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="scroll-mt-32 bg-card/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Cara kerja"
          title={
            <>
              Dua tahap. <span className="text-gradient-brand">Satu klik</span> per lowongan.
            </>
          }
          description="Upload CV cukup sekali. Setelah itu, Anda bisa mengecek puluhan lowongan tanpa upload ulang."
        />
        <div className="relative mt-14 grid gap-6 md:grid-cols-2">
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 hidden h-px w-24 -translate-x-1/2 border-t-2 border-dashed border-primary/30 md:block"
          />
          {steps.map(({ icon: Icon, stage, title, text, meta }, i) => (
            <FadeIn key={stage} delay={i * 0.12}>
              <div className="card-lift relative h-full overflow-hidden rounded-2xl border bg-card p-7 shadow-sm">
                <span
                  aria-hidden
                  className="absolute -top-6 -right-2 font-mono text-[7rem] leading-none font-bold text-primary/[0.06]"
                >
                  {i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-brand inline-flex size-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-primary uppercase">{stage}</p>
                    <p className="font-mono text-xs text-muted-foreground">{meta}</p>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScoreDemoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Demo interaktif"
        title="Skor yang jujur, dengan bobot yang dikunci"
        description="Skor dihitung dari 5 kategori dengan bobot tetap — jadi Anda bisa membandingkan lowongan satu dengan lainnya secara adil."
      />
      <FadeIn className="mt-14">
        <ScoreDemo />
      </FadeIn>
    </section>
  );
}

const features = [
  { icon: Sparkles, title: "AI membaca PDF langsung", text: "Tanpa parser pihak ketiga. Claude membaca CV Anda apa adanya, termasuk tabel dan kolom." },
  { icon: Globe2, title: "Deteksi syarat lokasi", text: "Otomatis menandai \"US Only\", \"EU Only\", \"Worldwide\", dan variasi lainnya." },
  { icon: Clock3, title: "Overlap jam dengan WIB", text: "Menerjemahkan UTC, CET, atau PST jadi jam kerja yang masuk akal untuk Anda." },
  { icon: ListChecks, title: "Matched vs Gaps", text: "Lihat skill mana yang sudah cocok dan celah mana yang perlu Anda siapkan." },
  { icon: History, title: "Tracker lamaran pribadi", text: "Tandai \"Sudah Apply\", lalu pantau status: Applied → Interview → Offer." },
  { icon: Scale, title: "Netral, tanpa menggurui", text: "AI tidak menyuruh Anda apply atau skip. Keputusan tetap 100% milik Anda." },
];

export function FeaturesSection() {
  return (
    <section className="bg-card/40 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Fitur" title="Semua yang Anda perlukan sebelum menekan tombol Apply" />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title}>
              <div className="card-lift group h-full rounded-2xl border bg-card p-6 shadow-sm">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Rizky Aditya",
    role: "Frontend Engineer · Bandung",
    initials: "RA",
    color: "bg-indigo-500",
    quote:
      "Dulu saya apply 40-an lowongan sebulan dan banyak yang ternyata US Only. Sekarang saya cek dulu, cuma apply yang skornya masuk akal. Dapat offer di bulan kedua.",
  },
  {
    name: "Dewi Saraswati",
    role: "Product Designer · Yogyakarta",
    initials: "DS",
    color: "bg-emerald-500",
    quote:
      "Bagian Gaps-nya paling berguna. Saya jadi tahu harus belajar Framer dulu sebelum melamar ke studio-studio Eropa. Rasanya seperti punya mentor karier.",
  },
  {
    name: "Bima Pratama",
    role: "Backend Developer · Surabaya",
    initials: "BP",
    color: "bg-rose-500",
    quote:
      "Info overlap jam kerjanya menyelamatkan saya dari lowongan yang mewajibkan standup jam 1 pagi WIB. Tracker-nya juga simpel, nggak perlu spreadsheet lagi.",
  },
  {
    name: "Nadia Fitriani",
    role: "Career Switcher → QA Engineer · Jakarta",
    initials: "NF",
    color: "bg-amber-500",
    quote:
      "Sebagai career switcher, saya butuh tahu skill mana yang kurang. Skor per kategorinya jelas dan bahasanya tidak menghakimi.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Cerita pengguna" title="Dipakai pencari kerja remote dari Sabang sampai Merauke" />
      <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
        {testimonials.map((t) => (
          <StaggerItem key={t.name}>
            <figure className="card-lift relative h-full rounded-2xl border bg-card p-7 shadow-sm">
              <Quote className="absolute top-6 right-6 size-8 text-primary/10" aria-hidden />
              <div className="flex gap-0.5 text-warning" aria-label="Rating 5 dari 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={`${t.color} inline-flex size-10 items-center justify-center rounded-full text-sm font-bold text-white`}>
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

const stats = [
  { value: "< 15 dtk", label: "Waktu analisis per lowongan" },
  { value: "5", label: "Kategori skor dengan bobot terkunci" },
  { value: "0", label: "Akun yang perlu Anda buat" },
  { value: "100%", label: "Gratis selama masa MVP" },
];

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <FadeIn>
        <div className="bg-gradient-brand relative overflow-hidden rounded-3xl px-6 py-14 text-white shadow-xl sm:px-14">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [--grid-line:rgb(255_255_255/0.12)]" />
          <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                Lowongan berikutnya mungkin cocok. Atau tidak. Cek dulu, baru melamar.
              </h2>
              <p className="mt-4 max-w-lg text-white/80">
                Tidak perlu daftar akun. Unggah CV, tempel Job Description, dan lihat skornya sekarang juga.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl" className="bg-white text-primary shadow-xl hover:bg-white/90">
                  <Link href="/upload" aria-label="Mulai cek kecocokan sekarang">
                    Mulai Cek Sekarang <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                <li className="flex items-center gap-1.5">
                  <UserX className="size-4" aria-hidden /> Tanpa akun
                </li>
                <li className="flex items-center gap-1.5">
                  <Lock className="size-4" aria-hidden /> PDF tidak disimpan
                </li>
                <li className="flex items-center gap-1.5">
                  <Trash2 className="size-4" aria-hidden /> Hapus data kapan saja
                </li>
              </ul>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-3xl font-bold">{s.value}</dd>
                  <dd className="mt-1 text-xs text-white/75">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </FadeIn>
      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <BadgeCheck className="size-4 text-success" aria-hidden />
        Testimoni & angka di halaman ini adalah contoh ilustrasi untuk versi demo.
      </p>
    </section>
  );
}
