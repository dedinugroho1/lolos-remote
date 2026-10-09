import { CalendarClock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Penjelasan bagaimana LolosRemote menyimpan profil CV di Neon PostgreSQL, menggunakan device ID anonim berbasis cookie, memproses data dengan Claude AI, dan hak Anda untuk menghapus data.",
  alternates: { canonical: "/kebijakan-privasi" },
};

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "ringkasan",
    title: "Ringkasan singkat",
    body: (
      <ul>
        <li>Kami tidak meminta nama, email, atau nomor HP. Tidak ada akun.</li>
        <li>File PDF CV Anda <strong>tidak disimpan</strong>; hanya ringkasan profil terstruktur (JSON).</li>
        <li>Lowongan yang Anda cek tidak disimpan, kecuali Anda menandainya &ldquo;Sudah Apply&rdquo;.</li>
        <li>Anda dapat menghapus seluruh data kapan saja dari halaman Profil Saya.</li>
      </ul>
    ),
  },
  {
    id: "data-dikumpulkan",
    title: "1. Data yang kami kumpulkan",
    body: (
      <>
        <p>Kami hanya mengumpulkan data yang diperlukan agar layanan berfungsi:</p>
        <ul>
          <li>
            <strong>Profil CV terstruktur</strong> — ringkasan, tingkat senioritas, skill teknis & non-teknis, riwayat
            pengalaman, bahasa, dan domain proyek yang diekstrak AI dari CV Anda, beserta nama file asli.
          </li>
          <li>
            <strong>Riwayat lamaran</strong> — hanya untuk lowongan yang Anda tandai &ldquo;Sudah Apply&rdquo;: judul,
            perusahaan, skor, info kritis, snapshot hasil analisis, teks Job Description, status, dan catatan Anda.
          </li>
          <li>
            <strong>ID sesi anonim</strong> — string acak (UUID v4) di cookie yang menghubungkan browser Anda dengan data
            di atas.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "penyimpanan",
    title: "2. Di mana data disimpan",
    body: (
      <>
        <p>
          Data disimpan di <strong>Neon PostgreSQL Serverless</strong> (region Asia Tenggara) dalam dua tabel:{" "}
          <code>cv_profiles</code> (maksimal 1 profil aktif per sesi) dan <code>saved_applications</code>. Koneksi database
          terenkripsi (TLS) dan setiap query wajib difilter berdasarkan ID sesi Anda.
        </p>
        <p>
          File PDF hanya berada di memori server selama proses pembacaan, lalu dibuang. Kami tidak menyimpannya di disk,
          object storage, maupun log.
        </p>
      </>
    ),
  },
  {
    id: "device-id",
    title: "3. Device ID anonim & cookie",
    body: (
      <>
        <p>
          Saat Anda pertama kali berkunjung, sistem membuat cookie bernama <code>lolosremote_session</code> berisi ID acak.
          Cookie ini:
        </p>
        <ul>
          <li>Bersifat <strong>HttpOnly</strong> (tidak bisa dibaca JavaScript), <strong>SameSite=Lax</strong>, dan <strong>Secure</strong> di production.</li>
          <li>Berlaku 30 hari sejak kunjungan terakhir.</li>
          <li>Tidak dipakai untuk iklan, pelacakan lintas situs, atau dibagikan ke pihak ketiga.</li>
        </ul>
        <p>
          Jika cookie terhapus atau Anda berganti browser, Anda akan dianggap pengunjung baru. Data lama tetap ada di
          database tetapi tidak dapat diakses lagi tanpa cookie tersebut.
        </p>
      </>
    ),
  },
  {
    id: "pemrosesan-ai",
    title: "4. Pemrosesan oleh AI (Anthropic Claude)",
    body: (
      <>
        <p>
          Untuk membaca CV dan menilai kecocokan, isi CV dan Job Description dikirim ke Claude API milik Anthropic melalui
          koneksi terenkripsi. Sesuai kebijakan Anthropic untuk API komersial, data input tidak digunakan untuk melatih
          model secara default.
        </p>
        <p>
          Sebelum dikirim, teks Job Description dibersihkan dari tag HTML/skrip. Output AI divalidasi skema dan di-escape
          sebelum ditampilkan.
        </p>
      </>
    ),
  },
  {
    id: "retensi",
    title: "5. Berapa lama data disimpan",
    body: (
      <p>
        Profil CV dan riwayat lamaran disimpan selama Anda masih menggunakannya. Anda bisa menghapusnya kapan saja. Data
        yang tidak dapat diakses (karena cookie sudah kedaluwarsa) dapat kami hapus secara berkala.
      </p>
    ),
  },
  {
    id: "hak-hapus",
    title: "6. Hak Anda untuk menghapus data",
    body: (
      <>
        <p>
          Buka halaman <Link href="/profil-saya">Profil Saya</Link> lalu pilih <strong>&ldquo;Hapus Semua Data
          Saya&rdquo;</strong>. Setelah konfirmasi dua langkah, kami akan:
        </p>
        <ol>
          <li>Menghapus baris profil Anda di <code>cv_profiles</code>.</li>
          <li>Menghapus seluruh baris lamaran Anda di <code>saved_applications</code>.</li>
          <li>Menghapus cookie sesi di browser Anda.</li>
        </ol>
        <p>
          Penghapusan bersifat <strong>permanen dan tidak dapat dipulihkan</strong>. Anda juga bisa menghapus lamaran satu
          per satu dari halaman detail lamaran.
        </p>
      </>
    ),
  },
  {
    id: "perubahan",
    title: "7. Perubahan kebijakan",
    body: (
      <p>
        Jika kebijakan ini berubah, tanggal &ldquo;Terakhir diperbarui&rdquo; di atas akan disesuaikan. Perubahan penting
        akan kami umumkan di beranda.
      </p>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      <PageHero
        eyebrow="Kebijakan Privasi"
        title="Privasi Anda bukan fitur tambahan"
        description="Dokumen ini menjelaskan dengan bahasa sederhana data apa yang kami simpan, di mana, untuk apa, dan bagaimana Anda menghapusnya."
      >
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <CalendarClock className="size-3.5" aria-hidden /> Terakhir diperbarui: 9 Oktober 2026
        </p>
      </PageHero>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Daftar isi" className="hidden lg:block">
          <div className="sticky top-32 space-y-1">
            <p className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">Daftar isi</p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>

        <article className="space-y-6">
          {sections.map((s, i) => (
            <FadeIn key={s.id} delay={Math.min(i * 0.04, 0.2)}>
              <section
                id={s.id}
                className={
                  "scroll-mt-32 rounded-2xl border bg-card p-6 shadow-sm sm:p-8 " +
                  (i === 0 ? "border-primary/20 bg-primary/[0.03]" : "")
                }
              >
                <h2 className="text-xl font-extrabold">{s.title}</h2>
                <div className="prose-lr mt-4">{s.body}</div>
              </section>
            </FadeIn>
          ))}
        </article>
      </div>
    </>
  );
}
