<div align="center">

# 🎯 LolosRemote

### Cek 1 Klik, Sebelum Buang Waktu Melamar

**AI CV Matcher, Job Application Tracker & Contract Risk Scanner untuk pencari kerja remote Indonesia.**
Unggah CV sekali, tempel Job Description, dan dapatkan skor kecocokan 0–100 dalam hitungan detik, lengkap dengan syarat tersembunyi seperti _"US Only"_, overlap zona waktu dengan WIB, dan skill yang belum Anda kuasai.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Claude API](https://img.shields.io/badge/Claude-Haiku_5.5-D97757?logo=anthropic&logoColor=white)](https://docs.anthropic.com)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?logo=postgresql&logoColor=white)](https://neon.tech)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-10b981.svg)](CONTRIBUTING.md)

<img src="docs/screenshots/beranda.jpg" alt="Beranda LolosRemote" width="820" />

</div>

---

## 🤔 Kenapa LolosRemote?

Banyak lamaran kerja remote gagal **bukan karena Anda kurang mampu**, tapi karena sejak awal lowongannya memang tidak bisa Anda lamar:

- 🌎 **Syarat tersembunyi.** "US Only" atau "EU residents" baru ketahuan di paragraf terakhir, setelah Anda menulis cover letter.
- ⏰ **Zona waktu bentrok.** Overlap 6 jam dengan PST berarti rapat jam 2 pagi WIB.
- ⌛ **30–60 menit terbuang.** Membaca ulang CV vs Job Description hanya untuk menjawab "saya cocok nggak, sih?"
- 📂 **Riwayat tercecer.** Lamaran tersebar di tab browser, spreadsheet, dan catatan HP.

LolosRemote menjadi **saringan pertama yang gratis, cepat, dan tidak menghakimi**, plus buku catatan lamaran pribadi, **tanpa perlu daftar akun**.

## ✨ Fitur

| | Fitur | Keterangan |
|---|---|---|
| 📄 | **Baca CV dengan AI** | PDF dibaca langsung oleh Claude (tanpa parser pihak ketiga) menjadi profil terstruktur: ringkasan, senioritas, skill, pengalaman, bahasa, domain. |
| 🎯 | **Skor Kecocokan 0–100** | 5 kategori dengan bobot terkunci: Skill Wajib (40), Pengalaman (20), Domain (15), Nice-to-have (15), Bahasa (10). |
| 🚩 | **Info Kritis Lowongan** | Deteksi otomatis syarat lokasi, overlap jam kerja dalam WIB, tipe kontrak, dan rentang gaji. |
| ✅ | **Matched vs Gaps** | Skill yang sudah cocok, celah yang perlu disiapkan, dan peringatan syarat wajib. |
| 🗂️ | **Tracker Lamaran** | Tandai "Sudah Apply", lalu pantau status Applied → Interview → Offer, dengan catatan, pencarian, filter, dan sort. |
| 🛡️ | **Audit Kontrak Kerja** | Unggah kontrak/offer letter: skor keamanan, klausul red flag/warning/aman, dan draf email negosiasi. |
| 🕶️ | **Tanpa Login** | Sesi anonim berbasis cookie HttpOnly. Hapus semua data kapan saja dengan satu tombol. |
| ⚖️ | **Netral** | AI tidak pernah menyuruh Anda "apply" atau "skip"; keputusan sepenuhnya milik Anda. |

## 📸 Tampilan

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/upload-profil.jpg" alt="Profil hasil baca CV" /><p align="center"><sub><b>Profil CV hasil bacaan AI</b></sub></p></td>
    <td width="50%"><img src="docs/screenshots/hasil-analisis.jpg" alt="Hasil analisis kecocokan" /><p align="center"><sub><b>Skor kecocokan, info kritis & gaps</b></sub></p></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/riwayat-lamaran.jpg" alt="Riwayat lamaran" /><p align="center"><sub><b>Tracker riwayat lamaran</b></sub></p></td>
    <td width="50%"><img src="docs/screenshots/audit-kontrak.jpg" alt="Audit kontrak kerja" /><p align="center"><sub><b>Audit risiko kontrak kerja</b></sub></p></td>
  </tr>
</table>

## ⚙️ Cara Kerja

```mermaid
flowchart LR
    A[📄 Unggah CV PDF] -->|Claude membaca PDF| B[(Profil JSON<br/>cv_profiles)]
    B --> C[📋 Tempel Job Description]
    C -->|Claude + Zod| D{🎯 Skor 0-100<br/>+ info kritis}
    D -->|Cek Lowongan Lain| C
    D -->|Tandai Sudah Apply| E[(Riwayat<br/>saved_applications)]
    E --> F[📈 Applied → Interview → Offer]
```

1. **Tahap 1, Unggah CV (sekali saja):** PDF dikirim ke Claude sebagai dokumen, hasilnya divalidasi skema Zod lalu disimpan sebagai JSON. File PDF **tidak pernah disimpan**.
2. **Tahap 2, Cek lowongan (berulang):** profil JSON + teks JD dinilai Claude. Hasilnya **tidak disimpan** kecuali Anda menekan "Tandai Sudah Apply".

## 🧰 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) App Router, React 19, TypeScript `strict`
- **UI:** [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) (Radix), [Lucide](https://lucide.dev), [Framer Motion](https://motion.dev), [Recharts](https://recharts.org)
- **AI:** [Anthropic Claude API](https://docs.anthropic.com) (`@anthropic-ai/sdk`) dengan structured outputs + validasi [Zod](https://zod.dev)
- **Database:** [Neon](https://neon.tech) PostgreSQL Serverless + [Drizzle ORM](https://orm.drizzle.team)
- **Auth:** Anonymous session via cookie HttpOnly `lolosremote_session` (tanpa login)

---

## 🚀 Coba di Komputer Anda

### Prasyarat

- **Node.js 20+** dan npm
- Akun **[Neon](https://neon.tech)** (gratis), untuk database PostgreSQL
- **API key [Anthropic](https://console.anthropic.com)**, untuk Claude. Biaya per cek sangat kecil dengan Claude Haiku 5.5.

### 1. Clone & install

```bash
git clone https://github.com/dedinugroho1/lolos-remote.git
cd lolos-remote
npm install
```

### 2. Siapkan environment

```bash
cp .env.example .env.local
```

Lalu isi minimal dua variabel ini di `.env.local`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ANTHROPIC_API_KEY=sk-ant-...
```

> 🔒 `.env.local` sudah masuk `.gitignore`. **Jangan pernah** commit file ini atau memberi prefix `NEXT_PUBLIC_` pada API key.

<details>
<summary><b>Daftar lengkap environment variable</b></summary>

| Variabel | Wajib | Default | Keterangan |
|---|:---:|---|---|
| `DATABASE_URL` | ✅ | | Connection string Neon (pooled, `sslmode=require`) |
| `ANTHROPIC_API_KEY` | ✅ | | API key Claude, hanya dipakai di server |
| `NEXT_PUBLIC_APP_URL` | | `http://localhost:3000` | URL publik aplikasi |
| `CLAUDE_MODEL` | | `claude-haiku-5-5` | Model utama |
| `CLAUDE_MODEL_FALLBACK` | | `claude-sonnet-5-5` | Model cadangan saat 429/5xx |
| `CLAUDE_MAX_TOKENS_PARSE` | | `8000` | Batas token baca CV |
| `CLAUDE_MAX_TOKENS_MATCH` | | `6000` | Batas token cek lowongan |
| `CLAUDE_MAX_TOKENS_AUDIT` | | `16000` | Batas token audit kontrak |
| `CLAUDE_TIMEOUT_AUDIT_MS` | | `120000` | Timeout audit kontrak |
| `SESSION_COOKIE_NAME` | | `lolosremote_session` | Nama cookie sesi |
| `SESSION_COOKIE_MAX_AGE` | | `2592000` | Umur cookie (detik, 30 hari) |
| `RATE_LIMIT_PARSE_PER_DAY` | | `20` | Kuota unggah CV per sesi/hari |
| `RATE_LIMIT_MATCH_PER_DAY` | | `100` | Kuota cek lowongan per sesi/hari |
| `RATE_LIMIT_AUDIT_PER_DAY` | | `20` | Kuota audit kontrak per sesi/hari |
| `NEXT_PUBLIC_ENABLE_DARK_MODE` | | `true` | Tampilkan tombol dark mode |

</details>

### 3. Buat tabel database

```bash
npm run db:push
```

### 4. Jalankan

```bash
npm run dev
```

Buka **http://localhost:3000**, klik **"Mulai Cek Sekarang"**, unggah CV PDF Anda, lalu tempel Job Description. Tidak punya JD? Klik **"Pakai contoh JD"** di halaman cek.

### (Opsional) Isi data contoh

```bash
npm run db:seed                 # buat sesi demo baru berisi 1 profil + 5 lamaran
npm run db:seed -- <session-id> # isi ke sesi browser Anda sendiri
```

Nilai `session-id` adalah isi cookie `lolosremote_session` (DevTools → Application → Cookies).

> 💡 **Tips:** cookie dibedakan per host. Buka `http://127.0.0.1:3000` untuk mendapat sesi kosong baru tanpa mengganggu data Anda di `localhost:3000`.

## 📜 Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Build & jalankan versi production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm run db:push` | Sinkronkan skema Drizzle ke database |
| `npm run db:generate` | Buat file migrasi SQL dari skema |
| `npm run db:migrate` | Jalankan file migrasi |
| `npm run db:studio` | Buka Drizzle Studio |
| `npm run db:seed` | Isi data demo |

## 🗺️ Struktur Proyek

```
src/
├── app/
│   ├── (marketing)/      # Beranda, Tentang, FAQ, Kebijakan Privasi (publik, SEO)
│   ├── (app)/            # Upload, Check, Result, History, Kontrak, Profil (noindex, per sesi)
│   └── api/              # Route Handlers (parse-cv, check-match, applications, audit-kontrak, …)
├── components/           # UI per fitur + shadcn/ui
├── db/                   # Skema Drizzle, koneksi Neon, seed
├── lib/
│   ├── ai/               # Prompt & pemetaan error Claude
│   ├── anthropic.ts      # Klien Claude: structured output, timeout, fallback model
│   ├── data/             # Query DB (selalu difilter user_session_id)
│   ├── schemas/          # Skema Zod (CV, hasil match, lamaran, audit kontrak)
│   └── client/           # Helper fetch & state sementara di browser
└── middleware.ts         # Pembuat sesi anonim (cookie HttpOnly)
drizzle/                  # File migrasi SQL
```

<details>
<summary><b>Endpoint API</b></summary>

Semua endpoint yang mengubah data wajib menyertakan header `X-Requested-With: XMLHttpRequest` (proteksi CSRF) dan hanya bisa mengakses data milik sesi cookie yang sama.

| Method | Endpoint | Fungsi |
|---|---|---|
| `POST` | `/api/parse-cv` | Unggah PDF (multipart `file`, maks 5MB) → profil CV |
| `POST` | `/api/check-match` | `{ jobDescription }` → hasil skor (tidak disimpan) |
| `POST` | `/api/save-application` | Simpan hasil cek sebagai lamaran |
| `GET` | `/api/applications` | Daftar lamaran milik sesi |
| `GET` `PATCH` `DELETE` | `/api/applications/[id]` | Detail / ubah status & catatan / hapus |
| `POST` | `/api/audit-kontrak` | Unggah PDF kontrak (maks 10MB) → hasil audit |
| `GET` `POST` | `/api/contract-audits` | Daftar / simpan hasil audit |
| `GET` `DELETE` | `/api/contract-audits/[id]` | Detail / hapus hasil audit |
| `DELETE` | `/api/profil-saya` | Hapus semua data sesi + cookie |

</details>

## 🔐 Privasi & Keamanan

- **Tanpa akun:** identitas Anda hanya UUID acak di cookie `HttpOnly`, `SameSite=Lax`, dan `Secure` di production.
- **PDF tidak disimpan:** hanya dibaca di memori selama request; yang tersimpan cuma ringkasan JSON.
- **Isolasi data:** setiap query database wajib difilter `user_session_id`.
- **Validasi ketat:** semua input & output AI divalidasi Zod. JD dibersihkan dari HTML/skrip, dan prompt dirancang tahan prompt-injection.
- **Rate limit** per sesi untuk menahan penyalahgunaan dan biaya API.
- **Hak hapus:** satu tombol di **Profil Saya** menghapus profil, riwayat, audit, dan cookie secara permanen.

Menemukan celah keamanan? Mohon laporkan secara privat lewat [GitHub Security Advisories](https://github.com/dedinugroho1/lolos-remote/security/advisories/new), bukan lewat issue publik.

## 🛣️ Roadmap

- [x] Fase 1: Fondasi, design system & semua halaman
- [x] Fase 2: Neon + Drizzle, sesi anonim, integrasi Claude API
- [x] Audit Kontrak Kerja (AI Contract Risk Scanner)
- [ ] Fase 3: Hardening keamanan (CSP, DOMPurify), SEO (OG image, sitemap), streaming progres AI, deploy Vercel
- [ ] Rate limit terdistribusi (Upstash Redis)
- [ ] Ekspor riwayat lamaran

## 🤝 Kontribusi

Kontribusi sangat diterima, mulai dari laporan bug, ide fitur, perbaikan copywriting, sampai pull request. Baca **[CONTRIBUTING.md](CONTRIBUTING.md)** untuk panduannya.

## 📄 Lisensi

Dirilis di bawah **[MIT License](LICENSE)**: bebas dipakai, dimodifikasi, dan didistribusikan, termasuk untuk keperluan komersial, selama menyertakan pemberitahuan hak cipta.

---

<div align="center">

Dibuat dengan ☕ oleh **[Dedi Nugroho](https://github.com/dedinugroho1)** untuk pencari kerja remote Indonesia.

Kalau proyek ini bermanfaat, beri ⭐ di GitHub agar lebih banyak orang menemukannya!

</div>
