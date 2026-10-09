# LolosRemote

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: LolosRemote
- **Penjelasan Singkat**: LolosRemote adalah alat bantu gratis berbasis AI yang mengecek kecocokan CV Anda dengan lowongan kerja remote dalam hitungan detik, sekaligus menjadi buku catatan pribadi untuk melacak lamaran kerja mana saja yang sudah Anda kirim — tanpa perlu daftar akun dan tanpa ribet.
- **Masalah yang Diselesaikan**:
  - Pencari kerja remote membuang waktu dan tenaga melamar lowongan yang sebenarnya sejak awal tidak bisa mereka lamar (contoh: syarat tersembunyi "US Only", zona waktu bentrok, atau skill wajib yang belum dikuasai).
  - Tidak ada cara cepat untuk menilai "apakah saya cocok?" sebelum menghabiskan 30-60 menit menulis cover letter.
  - Riwayat lamaran tersebar di banyak tab browser, spreadsheet, dan catatan HP sehingga mudah hilang.
  - Proses analisis manual butuh membaca ulang CV vs Job Description berulang kali, melelahkan dan tidak konsisten.
- **Pengguna Aplikasi**:
  - **Pencari Kerja Remote (Fresh Graduate sd. Senior)**: Butuh validasi cepat sebelum melamar dan butuh tracker lamaran pribadi.
  - **Freelancer / Kontraktor**: Ingin tahu apakah klien potensial cocok dengan skill mereka sebelum kirim proposal.
  - **Career Switcher**: Ingin tahu gap skill mana yang perlu ditutup untuk lowongan target.
  - **Tanpa Login**: Cukup buka situs, upload CV, dan langsung pakai — tanpa perlu membuat akun.
- **Target Keberhasilan**:
  - Pengguna bisa mengunggah CV dan mendapatkan profil terstruktur (JSON) dalam waktu kurang dari 30 detik.
  - Pengguna bisa menempelkan Job Description dan mendapatkan skor kecocokan 0-100 dalam waktu kurang dari 15 detik.
  - Pengguna cukup mengunggah CV satu kali, lalu bisa mengecek puluhan lowongan tanpa upload ulang.
  - Minimal 60% pengguna yang menyelesaikan tahap cek kecocokan menandai minimal satu lowongan sebagai "Sudah Apply" dalam sesi pertama mereka.
  - Data profil dan riwayat lamaran tetap dapat diakses dari perangkat yang sama meskipun cookie dipegang ulang dalam 30 hari.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Upload CV PDF (maks 5MB) dengan parsing AI native oleh Claude API (bukan parser eksternal).
- Anonymous Session berbasis Cookie + Device ID sebagai pengganti login (tanpa form registrasi).
- Ekstraksi CV menjadi profil JSON terstruktur (ringkasan, skill teknis, pengalaman, bahasa, tingkat senioritas, domain proyek) via Zod Schema.
- Paste Job Description dalam bentuk teks polos dan cek kecocokan 1-klik.
- Skor kecocokan 0-100 dengan ring indikator warna gradasi (merah → kuning → hijau).
- Rincian 5 kategori skor: Skill Teknis Wajib (40), Pengalaman & Senioritas (20), Domain Proyek (15), Nice-to-have Skill (15), Bahasa/Komunikasi (10).
- Kartu Info Kritis Lowongan: Syarat Lokasi, Zona Waktu / Overlap WIB, Tipe Kontrak, Rentang Gaji.
- Panel Matched vs Gaps dan peringatan syarat wajib yang belum terpenuhi.
- Simpan hanya lowongan yang ditandai "Sudah Apply" ke database (`saved_applications`).
- Halaman Riwayat Lamaran dengan daftar, status, fit score, dan notes per lamaran.
- Model Switcher via environment variable `CLAUDE_MODEL`.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Login/registrasi akun dengan email, Google, atau LinkedIn (dipakai Anonymous Session dulu).
- Notifikasi email/WhatsApp/push untuk pengingat follow-up lamaran (sesuai klarifikasi user).
- Import lowongan otomatis dari scraping job board (LinkedIn, Upwork, WeWorkRemotely, dsb).
- Kolaborasi tim, multi-user share riwayat.
- Auto-generate cover letter atau auto-apply ke portal.
- Analisis CV multi-bahasa selain Indonesia dan Inggris.
- Integrasi payment gateway (aplikasi 100% gratis di MVP).
- Export laporan PDF dari Riwayat Lamaran.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*

### A. Public Area (Tanpa Login, Tanpa Sesi)
- `/` (Beranda): Hero dengan value proposition "Cek 1 Klik, Sebelum Buang Waktu Melamar", penjelasan 2-stage pipeline, social proof dummy, CTA besar "Mulai Cek Sekarang", demo animated score ring.
- `/tentang` (Tentang LolosRemote): Cerita misi produk, penjelasan cara kerja AI, komitmen privasi data, FAQ teknologi.
- `/faq` (Tanya Jawab): Accordion berisi pertanyaan seputar privasi CV, batas ukuran PDF, model AI yang dipakai, cara reset sesi.
- `/kebijakan-privasi` (Kebijakan Privasi): Penjelasan penyimpanan CV di Neon, device ID anonymous, dan hak hapus data.

### B. Session User Area (Setelah Dapat Cookie & Device ID)
- `/upload` (Unggah CV): Form drag-and-drop PDF, progress bar parsing AI, tampilan preview hasil profil JSON yang siap dikonfirmasi. Jika sudah punya CV tersimpan, tampilkan kartu "CV Anda Sudah Tersimpan" dengan tombol "Perbarui CV" atau "Lanjut Cek Lowongan".
- `/check` (Cek Kecocokan): Textarea besar untuk paste Job Description, tombol "Cek Kecocokan", animasi loading scanning, form opsional kolom link lowongan.
- `/check/result` (Hasil Analisis — Transient): Halaman khusus menampilkan hasil analisis (score ring, breakdown 5 kategori, kartu info kritis, matched vs gaps, warning). Dua tombol keputusan: "Cek Lowongan Lain" (buang hasil, kembali ke `/check`) dan "Tandai Sudah Apply" (simpan ke riwayat, redirect ke `/history`).
- `/history` (Riwayat Lamaran): Daftar semua lamaran yang ditandai "Sudah Apply" dengan kartu ringkas, fit score badge, filter status, search bar.
- `/history/[id]` (Detail Lamaran): Detail lengkap satu lamaran termasuk hasil analisis yang disimpan, form edit notes, tombol ubah status (Applied → Interview → Offer → Rejected), tombol hapus lamaran.
- `/profil-saya` (Profil Saya): Ringkasan CV JSON yang tersimpan, tombol unduh CV, tombol hapus profil & reset sesi.

### C. Sistem / Teknis
- `/api/parse-cv` (Route Handler POST): Terima file PDF, kirim ke Claude API, simpan `cv_profiles`, kembalikan JSON terstruktur.
- `/api/check-match` (Route Handler POST): Terima Job Description + session ID, load `cv_profiles`, panggil Claude API, kembalikan hasil skor (tidak disimpan).
- `/api/save-application` (Route Handler POST): Simpan hasil cek yang di-apply ke `saved_applications`.
- `/api/applications` (Route Handler GET): Ambil seluruh riwayat lamaran milik session.
- `/api/applications/[id]` (Route Handler PATCH/DELETE): Update notes/status atau hapus lamaran.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*

- **Skema Warna**:
  - Primary (Brand Indigo): `HSL(243, 75%, 59%)` — dipakai di CTA utama, link aktif, dan gradien skor tinggi.
  - Primary Hover: `HSL(243, 75%, 52%)`.
  - Secondary (Sky Lembut): `HSL(214, 95%, 93%)` — latar chip, tag skill.
  - Success (Emerald Score Tinggi): `HSL(160, 84%, 39%)` — untuk skor 75-100.
  - Warning (Amber Skor Sedang): `HSL(38, 92%, 50%)` — untuk skor 50-74.
  - Danger (Rose Skor Rendah): `HSL(346, 77%, 50%)` — untuk skor 0-49.
  - Background Kanvas: `HSL(220, 20%, 98%)` dengan tekstur grid halus.
  - Surface / Card: `HSL(0, 0%, 100%)` dengan border `HSL(220, 13%, 91%)`.
  - Text Primary: `HSL(222, 47%, 11%)`.
  - Text Secondary: `HSL(215, 16%, 47%)`.

- **Tipografi**:
  - Heading: Font **Plus Jakarta Sans** (weight 600-800) — memberi kesan modern, tegas, dan ramah.
  - Body: Font **Inter** (weight 400-500) — keterbacaan tinggi untuk blok teks panjang dan angka skor.
  - Angka Skor & Data: Font **JetBrains Mono** (weight 500-700) untuk menegaskan nuansa "analitis".

- **Aturan Komponen**:
  - Sudut membulat: `rounded-2xl` untuk kartu utama, `rounded-xl` untuk input, `rounded-full` untuk badge dan skor ring.
  - Shadow: `shadow-sm` untuk kartu diam, `shadow-lg` + `-translate-y-0.5` saat hover, `shadow-xl` pada elemen CTA fokus.
  - Skor Ring: Gunakan `conic-gradient` atau Recharts RadialBar untuk visualisasi persen, dengan warna gradasi otomatis dari skala skor (merah → kuning → hijau).
  - Animasi: Framer Motion untuk transisi halaman (`fade-in-up`), progress bar scanning AI (`shimmer`), dan expand card (`layout` prop).

- **Nuansa & Vibe**:
  - Clean, modern, techno-friendly, dengan whitespace lega dan sedikit aksen gradien indigo.
  - Rasa "analitis namun hangat" — seperti dashboard pribadi, bukan panel korporat kaku.
  - Micro-animations: hover lift pada kartu, ripple pada tombol, mouse-follow glow halus di hero.
  - Dark mode opsional dengan palette gelap navy (`HSL(222, 47%, 8%)`) dan primary sedikit lebih cerah (`HSL(243, 82%, 68%)`).
  - Ikonografi dari **Lucide React** dengan stroke width 2 dan ukuran konsisten (16/20/24px).

---

## 5. Pembagian Hak Akses Pengguna
*Aplikasi ini adalah **Public Web + Anonymous Session** tanpa sistem login formal. Semua halaman dapat diakses publik; batasan hanya terletak pada scope data (dikelola berdasarkan Cookie Device ID).*

| Menu / Halaman | Pengunjung Baru (Belum Punya Cookie) | Pengunjung dengan Device ID (Belum Upload CV) | Pengunjung dengan Device ID + CV Tersimpan |
| :--- | :---: | :---: | :---: |
| `/` Beranda | ✅ | ✅ | ✅ |
| `/tentang`, `/faq`, `/kebijakan-privasi` | ✅ | ✅ | ✅ |
| `/upload` (Unggah CV) | ✅ | ✅ | ✅ (mode perbarui) |
| `/check` (Cek Kecocokan) | ❌ (redirect ke `/upload`) | ❌ (redirect ke `/upload`) | ✅ |
| `/check/result` (Hasil Analisis) | ❌ | ❌ | ✅ |
| `/history` (Riwayat Lamaran) | ✅ (kosong) | ✅ (kosong) | ✅ |
| `/history/[id]` (Detail Lamaran) | ✅ (hanya milik session sendiri) | ✅ (hanya milik session sendiri) | ✅ (hanya milik session sendiri) |
| `/profil-saya` (Profil & Reset) | ✅ | ✅ | ✅ |
| API `/api/parse-cv` | ✅ | ✅ | ✅ |
| API `/api/check-match` | ❌ (butuh CV di DB) | ❌ (butuh CV di DB) | ✅ |
| API `/api/save-application` | ❌ | ❌ | ✅ |
| API `/api/applications/*` | ✅ (scope session) | ✅ (scope session) | ✅ (scope session) |

**Catatan Keamanan Data**: Setiap pengunjung memiliki `user_session_id` unik yang digenerate sistem saat pertama kali mengakses situs. Data `cv_profiles` dan `saved_applications` hanya dapat dibaca/ditulis oleh request dengan `user_session_id` yang cocok. Tidak ada user lain yang bisa melihat data user lain.

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Modul Unggah & Parse CV (Stage 1)
1. **Cara Kerja**:
   - User membuka `/upload`, drag-and-drop atau klik untuk memilih file PDF (maks 5MB).
   - Frontend menampilkan progress bar animasi "AI sedang membaca CV Anda...", sambil mengirim file ke `/api/parse-cv`.
   - Backend membuatkan `user_session_id` baru (jika belum ada) dan menyimpannya dalam HttpOnly Cookie.
   - Backend mengirim PDF sebagai base64 ke Claude API dengan prompt terstruktur yang meminta output JSON sesuai skema Zod.
   - Claude mengembalikan JSON berisi profil terstruktur.
   - Backend menyimpan JSON ke tabel `cv_profiles` (unique by `user_session_id`), lalu mengembalikan ke frontend.
   - Frontend menampilkan preview profil (kartu ringkasan + daftar skill + daftar pengalaman) dan tombol "Lanjut Cek Lowongan".
2. **Aturan Sistem**:
   - Format file wajib `application/pdf`. Tolak file lain dengan pesan "Format file harus PDF".
   - Ukuran maksimal 5MB. Jika lebih, tampilkan "File maksimal 5MB".
   - Jika `cv_profiles` untuk `user_session_id` ini sudah ada, lakukan **UPSERT** (timpa versi lama) — hanya boleh ada 1 CV aktif per device.
   - Claude output wajib diparsing melalui `cvProfileSchema.parse()` (Zod); jika gagal, kembalikan error "AI gagal membaca CV, coba lagi".
   - File PDF TIDAK disimpan permanen di server — hanya JSON hasil parse.
   - Retry maksimal 1 kali otomatis jika Claude timeout (>25 detik).

### B. Modul Cek Kecocokan Lowongan (Stage 2)
1. **Cara Kerja**:
   - User membuka `/check`, menempel teks Job Description di textarea besar (min 50 karakter).
   - User klik "Cek Kecocokan".
   - Frontend menampilkan animasi scanning + pesan "AI sedang mencocokkan profil Anda...".
   - Backend load `profile_json` dari `cv_profiles` berdasarkan cookie session.
   - Backend memanggil Claude API dengan prompt yang berisi (1) profil CV dalam JSON, (2) teks JD raw, dan instruksi menghasilkan JSON sesuai `jobMatchSchema`.
   - Claude mengembalikan skor 0-100, breakdown 5 kategori, kartu info kritis, matched, gaps, dan warning.
   - Frontend menavigasi ke `/check/result` dan menampilkan hasil dalam layout kartu yang kaya.
2. **Aturan Sistem**:
   - Job Description yang di-paste minimal 50 karakter, maksimal 15.000 karakter (potong otomatis jika lebih).
   - Bobot skor DIKUNCI: Skill Teknis Wajib (maks 40), Pengalaman & Senioritas (maks 20), Domain Proyek (maks 15), Nice-to-have (maks 15), Bahasa/Komunikasi (maks 10). Total maks 100.
   - Skor akhir = penjumlahan 5 kategori, dibulatkan ke integer.
   - AI WAJIB memberi output netral — dilarang menyuruh "apply" atau "skip" secara eksplisit.
   - Deteksi otomatis kata kunci: "US only", "EU only", "worldwide", "anywhere", "timezone", "UTC", "WIB", "overlap", "contract", "full-time", "part-time".
   - Hasil rendering TIDAK disimpan ke database kecuali user klik "Tandai Sudah Apply".
   - Frontend harus menyimpan hasil sementara di React state / sessionStorage agar user bisa scroll, lalu pilih keputusan.

### C. Modul Keputusan User
1. **Cara Kerja**:
   - Setelah hasil tampil, user melihat dua tombol keputusan besar di bawah hasil: "Cek Lowongan Lain" dan "Tandai Sudah Apply".
   - **Cek Lowongan Lain**: Hapus state hasil, kembali ke `/check` dengan textarea kosong. User langsung bisa paste JD baru. CV tetap tersimpan.
   - **Tandai Sudah Apply**: Buka modal kecil untuk konfirmasi judul lowongan & nama perusahaan (auto-terisi dari hasil AI, bisa diedit) + kolom notes opsional.
2. **Aturan Sistem**:
   - Tombol "Tandai Sudah Apply" hanya bisa diklik jika skor sudah keluar.
   - Judul lowongan dan nama perusahaan wajib diisi sebelum simpan. Jika AI gagal mendeteksi, form kosong dan user wajib isi manual.
   - Setelah simpan sukses, tampilkan toast "Lamaran berhasil dicatat!" dan redirect ke `/history`.
   - Lowongan yang di-skip TIDAK disimpan sama sekali (privacy-friendly).

### D. Modul Riwayat Lamaran (Application Tracker)
1. **Cara Kerja**:
   - Halaman `/history` menampilkan semua lamaran milik session dalam bentuk grid kartu.
   - Setiap kartu menampilkan: Judul Lowongan, Nama Perusahaan, Fit Score badge dengan warna sesuai skala, Tanggal Apply, Syarat Lokasi, Status Lamaran (Applied / Interview / Offer / Rejected).
   - Ada search bar (cari judul/perusahaan), filter status (dropdown), dan sort (terbaru/terlama/skor tertinggi).
   - Klik kartu → buka `/history/[id]` untuk detail lengkap: kartu info kritis lowongan yang dulu dianalisis, matched vs gaps, breakdown skor, notes editable, dan dropdown status.
2. **Aturan Sistem**:
   - Query wajib filter by `user_session_id` (WHERE clause mutlak, tidak boleh bocor).
   - Status lamaran default saat disimpan: `applied`.
   - Enum status yang diizinkan: `applied`, `interview`, `offer`, `rejected`, `ghosted`.
   - Notes maksimal 2000 karakter.
   - Tombol hapus lamaran menggunakan modal konfirmasi (avoid accidental delete).
   - Urutan default: `applied_at DESC` (terbaru dulu).

### E. Modul Anonymous Session & Reset
1. **Cara Kerja**:
   - Saat request pertama masuk tanpa cookie, middleware generate UUID v4 sebagai `user_session_id` dan set sebagai cookie HttpOnly (maxAge 30 hari, path `/`).
   - Semua backend route membaca `user_session_id` dari cookie. Jika cookie hilang, user akan dianggap pengunjung baru (data lama tidak terhapus dari DB, hanya tidak terakses).
   - Di `/profil-saya`, user bisa klik "Hapus Semua Data Saya" untuk menghapus row `cv_profiles` dan semua `saved_applications` milik session, lalu cookie dihapus.
2. **Aturan Sistem**:
   - Cookie wajib `HttpOnly`, `SameSite=Lax`, dan `Secure` di production.
   - Nama cookie: `lolosremote_session`.
   - Endpoint hapus data: `DELETE /api/profil-saya` → hapus row + clear cookie.
   - Data yang sudah dihapus tidak dapat dipulihkan (tampilkan konfirmasi ganda).

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout** (`(marketing)` group): Header sticky dengan logo LolosRemote di kiri, nav kiri (Beranda, Tentang, FAQ), dan CTA "Cek Sekarang" di kanan. Footer dengan komitmen privasi, link kebijakan, dan copyright.
- **App Layout** (`(app)` group): Header minimalis lebih ringkas (logo + indikator "CV Tersimpan ✓" + link Riwayat Lamaran + Profil Saya). Tanpa sidebar besar karena alur linear.
- **Result Layout** (khusus `/check/result`): Kartu full-width dua kolom desktop (kiri: ring + breakdown, kanan: info kritis + matched/gaps), kolom tunggal di mobile.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung Masuk] --> B[Sistem Cek/Create Session Cookie]
    B --> C{Halaman?}
    C -->|Beranda| D[Landing /]
    D --> E[Klik Mulai Cek]
    E --> F[Upload CV /upload]
    F --> G[POST /api/parse-cv ke Claude API]
    G --> H{Parse Sukses?}
    H -->|Gagal| I[Toast Error + Retry]
    I --> F
    H -->|Sukses| J[Simpan ke cv_profiles]
    J --> K[Preview Profil]
    K --> L[Lanjut ke /check]
    L --> M[Paste Job Description]
    M --> N[POST /api/check-match]
    N --> O[Claude Match dengan Profile JSON]
    O --> P[Tampilkan Hasil /check/result]
    P --> Q{Keputusan User}
    Q -->|Cek Lowongan Lain| M
    Q -->|Tandai Sudah Apply| R[POST /api/save-application]
    R --> S[Simpan ke saved_applications]
    S --> T[Redirect ke /history]
    T --> U[Detail /history/:id]
    U --> V[Edit Notes / Update Status]
    C -->|Langung Ke History| W[/history]
    W --> T
    C -->|Profil Saya| X[/profil-saya]
    X --> Y[Reset / Hapus Semua Data]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*

- **SEO**:
  - Tag `<title>` dinamis via Next.js Metadata API di setiap halaman publik (contoh: "LolosRemote — Cek Kecocokan CV dengan Lowongan Remote dalam Hitungan Detik").
  - Meta description unik per halaman (Beranda, Tentang, FAQ, Kebijakan Privasi).
  - Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`) dengan OG image 1200x630 bertema "skor kecocokan".
  - `robots.txt` dan `sitemap.xml` otomatis via Next.js App Router.
  - Structured Data JSON-LD `WebApplication` untuk halaman Beranda.
  - Canonical URL di setiap halaman untuk mencegah duplikasi.
  - **PENTING**: Halaman `/check`, `/check/result`, `/history`, `/history/[id]`, `/profil-saya`, `/upload` WAJIB `noindex, nofollow` karena bersifat personal per session.

- **Keamanan**:
  - Validasi input sisi server wajib menggunakan Zod di setiap Route Handler.
  - Sanitasi HTML Job Description (strip tag script, iframe) sebelum dikirim ke Claude untuk cegah prompt injection dan XSS.
  - Sanitasi output Claude sebelum di-render (escape HTML).
  - Cookie session wajib `HttpOnly`, `Secure` (di prod), `SameSite=Lax`.
  - Rate limiting per session ID: maks 20 request `/api/parse-cv` per hari, dan 100 request `/api/check-match` per hari (via Upstash Ratelimit atau in-memory LRU).
  - Batasan ukuran body request di Route Handler (5MB untuk CV, 100KB untuk JD text).
  - Content-Security-Policy header via `next.config.js` header rules.
  - Proteksi CSRF: sebab API dijalankan same-origin & cookie SameSite=Lax, plus wajib menyertakan header `X-Requested-With: XMLHttpRequest` dari frontend.
  - API key Anthropic WAJIB hanya ada di server env, tidak boleh bocor ke client bundle (`NEXT_PUBLIC_` DILARANG untuk API key).

- **Performa**:
  - Unggah CV menggunakan streaming request jika memungkinkan; JANGAN full-buffer ke memori server.
  - Lazy loading komponen berat (Recharts, Framer Motion timeline) via `next/dynamic` dengan `ssr: false` untuk chart.
  - Caching: halaman marketing dapat di-cache, tapi halaman app harus `dynamic = 'force-dynamic'` karena bergantung pada cookie.
  - Panggilan Claude API: streaming response (o stream) ke UI agar user melihat progres, dan `max_tokens` di-cap (2.000 untuk parse, 1.500 untuk match) untuk hemat biaya.
  - Index database pada `saved_applications.user_session_id` untuk mempercepat query riwayat.
  - Menggunakan Neon Serverless Driver untuk koneksi lazy & pooling otomatis.

- **Aksesibilitas (Bonus)**:
  - Semua tombol memiliki `aria-label`, skor ring memiliki `role="img"` + teks alt.
  - Kontras teks minimal AA (ratio 4.5:1).
  - Fokus state jelas untuk navigasi keyboard.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*

- **Gaya Bahasa**: Profesional namun hangat dan membumi. Gunakan kata "Anda" dan "Kami". Hindari jargon teknis berlebih di UI user (misal: jangan tulis "inference token limit", tulis "ukuran file maksimal 5MB"). Di halaman hasil, gunakan kalimat netral tanpa memaksa (dilarang: "Kamu pasti gagal, jangan apply").

- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks aplikasi.

- **Contoh Data Dummy untuk `cv_profiles.profile_json`**:
```json
{
  "summary": "Frontend Engineer dengan 4 tahun pengalaman membangun aplikasi web SaaS menggunakan React dan Next.js. Terbiasa bekerja remote dengan tim lintas zona waktu.",
  "seniority_level": "mid",
  "technical_skills": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "React Query", "Node.js", "PostgreSQL", "Playwright", "Figma"],
  "soft_skills": ["Komunikasi asinkron", "Dokumentasi teknikal", "Code review"],
  "experiences": [
    {
      "title": "Frontend Engineer",
      "company": "Kopi Digital Indonesia",
      "duration": "Jan 2022 - Sekarang",
      "highlights": [
        "Memimpin migrasi aplikasi internal dari CRA ke Next.js 14 App Router, menurunkan LCP 42%.",
        "Membangun design system internal yang dipakai 6 tim produk."
      ]
    },
    {
      "title": "Junior Web Developer",
      "company": "Startup Lokal Nusantara",
      "duration": "Agu 2020 - Des 2021",
      "highlights": [
        "Mengembangkan landing page dan dashboard CMS dengan React dan Vite.",
        "Menulis 120+ komponen reusable dengan Storybook."
      ]
    }
  ],
  "languages": [
    { "name": "Bahasa Indonesia", "proficiency": "Native" },
    { "name": "English", "proficiency": "Professional Working Proficiency" }
  ],
  "domains": ["SaaS B2B", "E-commerce", "Fintech"]
}
```

- **Contoh Data Dummy untuk Hasil Match (rendering `/check/result`)**:
  - **Judul Lowongan**: Senior Frontend Engineer (Remote)
  - **Perusahaan**: Northwind Labs
  - **Fit Score**: 78 / 100
  - **Breakdown**: Skill Teknis Wajib 33/40, Pengalaman 15/20, Domain 12/15, Nice-to-have 10/15, Bahasa 8/10
  - **Info Kritis**: Lokasi "Worldwide (Europe preferred)", Overlap "4 jam dengan WIB", Kontrak "Full-time Independent Contractor", Gaji "USD 4.000 - 6.000/bulan"
  - **Matched**: React, Next.js, TypeScript, Tailwind, PostgreSQL, English proficiency
  - **Gaps**: Belum ada pengalaman dengan GraphQL, belum ada kontribusi open-source yang ditonjolkan
  - **Peringatan**: "Lowongan meminta overlap minimal 4 jam dengan CET; konfirmasi ketersediaan jam kerja Anda."

- **Contoh Data Dummy untuk `saved_applications`** (5 baris awal saat seed):
  - Frontend Engineer (Remote) — Northwind Labs — Skor 78 — Worldwide — Status applied
  - React Developer — Kreativa Studio — Skor 62 — Asia Pacific Only — Status interview
  - Fullstack Engineer — PayFlow Inc — Skor 85 — Worldwide — Status offer
  - UI Engineer — Orbit Health — Skor 41 — US Only — Status rejected
  - Frontend Contractor — Kopi Remotes — Skor 71 — Europe Overlap 4 Jam — Status applied

- **Microcopy Tombol Utama**:
  - Upload: "Unggah CV Anda" / "Baca Ulang CV" / "Lanjut Cek Lowongan".
  - Check: "Tempel Job Description di Bawah" / "Cek Kecocokan" / "AI sedang menilai...".
  - Result: "Cek Lowongan Lain" / "Tandai Sudah Apply".
  - History: "Riwayat Lamaran Anda" / "Belum ada lamaran yang tercatat — yuk cek lowongan pertamamu."

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*

- **Bahasa & Framework**: Next.js 15 (App Router) + TypeScript mode `strict: true`, React 19, Node.js runtime untuk Route Handlers.
- **Tampilan Antarmuka (UI)**: Tailwind CSS v4, shadcn/ui (Button, Card, Input, Dialog, DropdownMenu, Tabs, Toast, Badge), Lucide React untuk ikon, Framer Motion untuk animasi, Recharts untuk RadialBar skor dan Bar chart breakdown.
- **AI Engine**: Anthropic Claude API via `@anthropic-ai/sdk`. File PDF dikirim sebagai konten `document` base64 (native PDF reading, tanpa parser eksternal). Output diarahkan ke JSON terstruktur via prompt + validasi Zod.
- **Autentikasi**: TIDAK ADA login. Menggunakan **Anonymous Session** berbasis HttpOnly Cookie bernama `lolosremote_session` (UUID v4) yang digenerate middleware Next.js. Device ID adalah cookie itu sendiri; fallback ke `localStorage` device id hanya untuk analytics client-side.
- **Basis Data (Database)**: Neon PostgreSQL Serverless + Drizzle ORM + `@neondatabase/serverless` driver.

### Struktur Skema Database Nyata
```typescript
// src/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enum status lamaran
export const applicationStatusEnum = ['applied', 'interview', 'offer', 'rejected', 'ghosted'] as const;
export type ApplicationStatus = (typeof applicationStatusEnum)[number];

// Tabel: cv_profiles — 1 CV aktif per device/session
export const cvProfiles = pgTable(
  'cv_profiles',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userSessionId: text('user_session_id').notNull(),
    profileJson: jsonb('profile_json').notNull(), // menampung CvProfileSchema
    originalFileName: text('original_file_name'),
    claudeModel: text('claude_model').notNull().default('claude-haiku-5-5'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionUniq: uniqueIndex('cv_profiles_session_uniq').on(table.userSessionId),
  }),
);

// Tabel: saved_applications — hanya lowongan yang ditandai apply
export const savedApplications = pgTable(
  'saved_applications',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userSessionId: text('user_session_id').notNull(),
    jobTitle: text('job_title').notNull(),
    companyName: text('company_name').notNull(),
    fitScore: integer('fit_score').notNull(),
    locationRequirement: text('location_requirement'),
    timezoneOverlap: text('timezone_overlap'),
    contractType: text('contract_type'),
    salaryRange: text('salary_range'),
    matchResultJson: jsonb('match_result_json').notNull(), // snapshot hasil analisis
    matchedSkills: jsonb('matched_skills').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    gaps: jsonb('gaps').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    mandatoryWarnings: jsonb('mandatory_warnings').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
    status: text('status').$type<ApplicationStatus>().notNull().default('applied'),
    notes: text('notes'),
    appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionIdx: index('saved_applications_session_idx').on(table.userSessionId),
    appliedAtIdx: index('saved_applications_applied_at_idx').on(table.appliedAt),
  }),
);

export type CvProfileRow = typeof cvProfiles.$inferSelect;
export type SavedApplicationRow = typeof savedApplications.$inferSelect;
export type NewSavedApplication = typeof savedApplications.$inferInsert;
```

### Skema Zod untuk Output AI
```typescript
// src/lib/schemas/cv-profile.ts
import { z } from 'zod';

export const cvProfileSchema = z.object({
  summary: z.string().min(20).max(1500),
  seniority_level: z.enum(['fresh_graduate', 'junior', 'mid', 'senior', 'lead']),
  technical_skills: z.array(z.string()).min(3).max(60),
  soft_skills: z.array(z.string()).max(20),
  experiences: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      highlights: z.array(z.string()).max(6),
    }),
  ).max(15),
  languages: z.array(
    z.object({
      name: z.string(),
      proficiency: z.string(),
    }),
  ),
  domains: z.array(z.string()).max(15),
});
export type CvProfile = z.infer<typeof cvProfileSchema>;
```
```typescript
// src/lib/schemas/job-match.ts
import { z } from 'zod';

export const jobMatchSchema = z.object({
  fit_score: z.number().int().min(0).max(100),
  summary: z.string().min(20).max(1500),
  score_breakdown: z.object({
    technical_skills: z.number().min(0).max(40),
    experience_seniority: z.number().min(0).max(20),
    domain_project: z.number().min(0).max(15),
    nice_to_have: z.number().min(0).max(15),
    language_communication: z.number().min(0).max(10),
  }),
  job_info: z.object({
    job_title: z.string(),
    company_name: z.string(),
    location_requirement: z.string(),
    timezone_overlap: z.string(),
    contract_type: z.string(),
    salary_range: z.string(),
  }),
  matched: z.array(z.string()).max(40),
  gaps: z.array(z.string()).max(40),
  mandatory_warnings: z.array(z.string()).max(10),
});
export type JobMatchResult = z.infer<typeof jobMatchSchema>;
```

### Drizzle Config & Migration
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
} satisfies Config;
```

### Variabel Lingkungan (`.env.example`)
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx.ap-southeast-1.aws.neon.tech/lolosremote?sslmode=require

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx
CLAUDE_MODEL=claude-haiku-5-5
CLAUDE_MODEL_FALLBACK=claude-sonnet-5-5

# Session
SESSION_COOKIE_NAME=lolosremote_session
SESSION_COOKIE_MAX_AGE=2592000

# Rate Limit (opsional: Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxx
RATE_LIMIT_PARSE_PER_DAY=20
RATE_LIMIT_MATCH_PER_DAY=100

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks) dengan format checklist markdown `- [ ] **Task X.Y**`. Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Antigravity, Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah secara terukur, modular, dan bebas dari kehabisan context window.*

> **MODE EKSEKUSI: PHASE (Bertahap per Fase/Milestone)**. AI Coding Assistant wajib menyelesaikan 1 Fase secara UTUH dalam satu putaran, lalu berhenti melapor dan menunggu konfirmasi user sebelum lanjut ke Fase berikutnya.

### Fase 1: Fondasi Proyek, UI/UX, & Semua Halaman (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual secara 100% lengkap dan responsif menggunakan data dummy sebelum menyentuh database.*

- [ ] **Task 1.1 (Foundations & Design System)**: Inisialisasi proyek Next.js 15 + TypeScript strict, konfigurasi Tailwind CSS v4 dengan CSS variable token warna LolosRemote (Primary Indigo, Success Emerald, Warning Amber, Danger Rose), muat font Plus Jakarta Sans + Inter + JetBrains Mono via `next/font`, install `lucide-react`, `framer-motion`, `recharts`, dan `shadcn/ui` (Button, Card, Input, Dialog, Table, Badge, DropdownMenu, Tabs, Toast, Accordion, Progress, Textarea).
- [ ] **Task 1.2 (Layouts Persisten)**: Buat `src/app/layout.tsx` (Root), `src/app/(marketing)/layout.tsx` dengan Header sticky + Footer, dan `src/app/(app)/layout.tsx` dengan Header minimal (logo + indikator status CV + link ke `/history` dan `/profil-saya`). Tambahkan animasi Framer Motion untuk page transition.
- [ ] **Task 1.3 (Halaman Beranda `/`)**: Bangun hero dengan headline "Cek 1 Klik, Sebelum Buang Waktu Melamar", animasi mouse-follow glow, section alur 2-tahap (Upload → Cek), section demo Score Ring Recharts interaktif, section daftar fitur, testimoni dummy Indonesia, dan CTA besar "Mulai Cek Sekarang" → `/upload`.
- [ ] **Task 1.4 (Halaman Statis: `/tentang`, `/faq`, `/kebijakan-privasi`)**: Buat 3 halaman statis lengkap dengan konten Indonesia yang membumi, FAQ accordion interaktif, dan animasi fade-in-up section.
- [ ] **Task 1.5 (Halaman Upload CV `/upload`)**: Buat form drag-and-drop PDF menggunakan `react-dropzone` (dummy), validasi client (maks 5MB, wajib PDF), progress bar shimmer "AI sedang membaca CV...", lalu tampilkan preview profil dummy dari `cvProfileSchema` (kartu ringkasan + tag skill + timeline pengalaman) dan tombol "Lanjut Cek Lowongan" → `/check`. Sertakan state "CV sudah tersimpan" untuk demo mode perbarui.
- [ ] **Task 1.6 (Halaman Cek Kecocokan `/check`)**: Buat Textarea besar untuk paste JD, counter karakter (min 50 / maks 15.000), tombol "Cek Kecocokan", animasi scanning dummy 2 detik, lalu navigate ke `/check/result` dengan state dummy.
- [ ] **Task 1.7 (Halaman Hasil `/check/result`)**: Bangun layout dua kolom: (kiri) Score Ring Recharts gradient + breakdown 5 kategori (Recharts Bar), (kanan) Kartu Info Kritis (Lokasi, Zona Waktu, Kontrak, Gaji) + panel Matched vs Gaps + Warning banner. Di bawah, tombol dual "Cek Lowongan Lain" (kembali ke `/check`) dan "Tandai Sudah Apply" (buka modal konfirmasi form judul/company/notes → dummy simpan → toast + redirect ke `/history`).
- [ ] **Task 1.8 (Halaman Riwayat Lamaran `/history`)**: Bangun grid kartu lamaran dengan data dummy 5 baris Indonesia (lihat Bab 9), search bar, filter status (Applied/Interview/Offer/Rejected), sort by date & fit score, empty state ilustratif.
- [ ] **Task 1.9 (Halaman Detail Lamaran `/history/[id]`)**: Buat halaman detail dengan data dummy match snapshot, form notes editable, dropdown status lamaran, tombol hapus lamaran (modal konfirmasi).
- [ ] **Task 1.10 (Halaman Profil Saya `/profil-saya`)**: Tampilkan ringkasan profil CV dummy, tombol "Perbarui CV" (link ke `/upload`), tombol "Unduh JSON", dan tombol danger "Hapus Semua Data Saya" dengan modal konfirmasi dua langkah.
- [ ] **Task 1.11 (Polishing Responsiveness & Micro-animations)**: Audit seluruh halaman di breakpoint mobile/tablet/desktop, tambahkan micro-animations hover lift, focus ring, dan toast feedback. Pastikan dark mode toggle bekerja (opsional).

### Fase 2: Database, Anonymous Session, Claude API, & Integrasi Data Dinamis
*Tujuan: Menghidupkan aplikasi dengan database Neon, sistem Anonymous Session, dan panggilan Claude API nyata.*

- [ ] **Task 2.1 (Database Schema & Migrations)**: Setup Neon PostgreSQL, Drizzle ORM, buat `src/db/schema.ts` (tabel `cv_profiles` dan `saved_applications` sesuai Bab 10), file `drizzle.config.ts`, connection client `src/db/index.ts` dengan `@neondatabase/serverless`, jalankan `drizzle-kit generate` dan `drizzle-kit push` untuk migrasi.
- [ ] **Task 2.2 (Anonymous Session Middleware)**: Buat `src/middleware.ts` yang men-generate `user_session_id` (UUID v4) jika cookie `lolosremote_session` belum ada, set cookie HttpOnly/SameSite=Lax/Secure (di prod) dengan maxAge 30 hari, dan expose helper `getSessionId(req)` di `src/lib/session.ts`. Pastikan matcher tidak mengganggu asset Next.js.
- [ ] **Task 2.3 (Claude Client & Zod Schemas)**: Buat `src/lib/anthropic.ts` untuk inisialisasi `@anthropic-ai/sdk` dengan model dinamis `process.env.CLAUDE_MODEL ?? 'claude-haiku-5-5'` dan fallback ke `CLAUDE_MODEL_FALLBACK` saat error 429/500. Buat `src/lib/schemas/cv-profile.ts` dan `src/lib/schemas/job-match.ts` (Zod) sesuai Bab 10.
- [ ] **Task 2.4 (API Route `/api/parse-cv`)**: Buat Route Handler POST yang (1) validasi file PDF & ukuran <= 5MB, (2) kirim base64 ke Claude API sebagai `document` content-block dengan prompt "Ekstrak CV ini ke JSON sesuai skema...", (3) parse output via `cvProfileSchema.parse()`, (4) UPSERT ke `cv_profiles` by `user_session_id`, (5) return JSON. Terapkan rate limiting 20 req/hari.
- [ ] **Task 2.5 (API Route `/api/check-match`)**: Buat Route Handler POST yang (1) verifikasi cookie session & ambil `profile_json` dari `cv_profiles`, (2) sanitasi input JD (strip HTML, cap 15.000 karakter), (3) kirim ke Claude dengan prompt pencocokan + skema Zod `jobMatchSchema`, (4) parse & hitung total 5 kategori, (5) return hasil TANPA simpan ke DB. Terapkan rate limiting 100 req/hari.
- [ ] **Task 2.6 (API Route `/api/save-application` + `/api/applications` + `/api/applications/[id]`)**: Buat Route Handler: (1) POST/save menyimpan JD snapshot + hasil match ke `saved_applications`, (2) GET/applications mengembalikan list by session (guard WHERE `user_session_id`), (3) PATCH update status/notes, (4) DELETE hapus row. Semua wajib validasi Zod dan filter `user_session_id`.
- [ ] **Task 2.7 (Frontend Data Binding - Upload & Check)**: Ganti semua data dummy di `/upload` dan `/check` dengan panggilan `fetch` ke API asli. Implementasikan milestone status (idle → uploading → parsing → done/error) dengan toast error + retry.
- [ ] **Task 2.8 (Frontend Data Binding - Result & History)**: Ganti data dummy di `/check/result`, `/history`, `/history/[id]`, dan `/profil-saya` dengan data dari API. Pastikan tombol "Tandai Sudah Apply" memanggil `/api/save-application` dan redirect benar.
- [ ] **Task 2.9 (Seed Data & Testing Lokal)**: Buat script `src/db/seed.ts` untuk menyisipkan 1 profil contoh dan 5 lamaran contoh ke database demo. Uji end-to-end di localhost: upload CV → cek lowongan → apply → lihat riwayat → edit notes → hapus.

### Fase 3: Penyempurnaan UX, Keamanan, SEO, & Deployment Production
*Tujuan: Menyempurnakan pengalaman pengguna, menerapkan keamanan production-grade, optimasi performa, dan rilis ke Vercel.*

- [ ] **Task 3.1 (Error Handling & Edge Cases)**: Tangani semua skenario error: PDF tidak valid, file > 5MB, Claude timeout (>25s), Claude balas JSON invalid (Zod parse gagal), rate limit tercapai (tampil pesan ramah + tombol coba besok), cookie hilang, dan koneksi database terputus. Tampilkan toast konsisten + logging server-side via `console.error` terstruktur.
- [ ] **Task 3.2 (SEO & Metadata Dinamis)**: Implementasikan Next.js Metadata API untuk 4 halaman publik (`/`, `/tentang`, `/faq`, `/kebijakan-privasi`) dengan title & description unik Indonesia, Open Graph image dinamis via `opengraph-image.tsx`, `robots.txt` + `sitemap.xml` otomatis, dan noindex pada semua halaman app area. Tambahkan JSON-LD WebApplication di Beranda.
- [ ] **Task 3.3 (Keamanan & Hardening)**: Set header keamanan via `next.config.js` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy), pastikan cookie `HttpOnly/Secure/SameSite=Lax`, sanitasi input JD pakai DOMPurify server-side, validasi ulang semua payload di route handler pakai Zod, dan pastikan `ANTHROPIC_API_KEY` tidak pernah muncul di client bundle (grep build output untuk verifikasi).
- [ ] **Task 3.4 (Optimasi Performa)**: Lazy-load Recharts & Framer Motion kompleks via `next/dynamic` (ssr: false), cap `max_tokens` Claude (2.000 parse / 1.500 match), aktifkan streaming response dari Claude untuk progress bar real-time, tambahkan index DB (sudah di Task 2.1), dan ukur Lighthouse ≥ 90 di semua kategori.
- [ ] **Task 3.5 (End-to-End Testing & Bugfix)**: Uji 5 user journey utama (new user upload → check → skip; upload → check → apply; upload ulang CV; edit notes & status; reset data) di Chrome, Safari, Firefox, mobile Android, mobile iOS. Perbaiki responsive glitches, animation janky, dan query lambat.
- [ ] **Task 3.6 (Production Build & Deployment)**: Setup `.env.production` di Vercel (NEXT_PUBLIC_APP_URL, DATABASE_URL Neon production branch, ANTHROPIC_API_KEY, CLAUDE_MODEL, dsb), verifikasi `npm run build` lulus tanpa error TypeScript, deploy ke Vercel, jalankan migrasi `drizzle-kit push` untuk production DB, dan smoke test seluruh alur di domain production.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / GitHub Copilot / Roo Code / dll.) untuk memulai pengerjaan:*
```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer (gunakan model Opus 5.5 kamu untuk reasoning arsitektur).

Saya ingin membangun aplikasi **LolosRemote** — AI CV Matcher & Job Application Tracker — berdasarkan dokumen PRD ini.

Silakan baca file @PRD.md secara menyeluruh.

ATURAN EKSEKUSI (WAJIB DIPATUHI - MODE PHASE):
1. Kita bekerja dengan **MODE PHASE**. Artinya:
   - Selesaikan **seluruh Task di dalam 1 Fase secara UTUH** dalam satu putaran kerja (contoh: Fase 1 berisi Task 1.1 sampai Task 1.11 — kerjakan SEMUA sampai selesai, tidak boleh berhenti di tengah Fase).
   - Setelah 1 Fase selesai, WAJIB berhenti, laporkan hasil (folder & file yang dibuat, screenshot/deskripsi UI, cara menjalankan), lalu **MENUNGGU konfirmasi user** sebelum memulai Fase berikutnya.
   - JANGAN PERNAH melompat ke Fase 2 sebelum user konfirmasi Fase 1 selesai.
2. JANGAN PERNAH membuat semua kode untuk semua Fase sekaligus — ini untuk menjaga context window tetap sehat.
3. Tech Stack WAJIB: Next.js 15 App Router + TypeScript strict, Tailwind CSS v4, shadcn/ui, Lucide React, Framer Motion, Recharts, Drizzle ORM, Neon PostgreSQL Serverless, `@anthropic-ai/sdk` (model default `claude-haiku-5-5` via env `CLAUDE_MODEL`).
4. Autentikasi: WAJIB pakai **Anonymous Session (Cookie `lolosremote_session`)** — TIDAK ADA form login.
5. Skema DB WAJIB persis seperti Bab 10 (`cv_profiles`, `saved_applications`).
6. Design System WAJIB persis seperti Bab 4 (warna Indigo/Emerald/Amber/Rose, font Plus Jakarta Sans + Inter + JetBrains Mono, rounded-2xl, shadow-sm→lg hover).
7. DILARANG membuat halaman placeholder / "coming soon" — semua halaman di Bab 3 WAJIB dibuat 100% fungsional lengkap dengan data dummy Indonesia (Fase 1) lalu data real (Fase 2).

ALUR KERJA YANG DIHARAPKAN:
- Konfirmasi bahwa kamu sudah membaca PRD + ringkas pemahamanmu tentang LolosRemote (2 paragraf).
- Konfirmasi rencana eksekusi Fase 1 (Task 1.1 s.d. Task 1.11) secara singkat dalam bentuk bullet list.
- Setelah user setuju, MULAI Task 1.1 dan tuntaskan seluruh Fase 1 dalam satu putaran.
- Setelah Fase 1 selesai: STOP, laporkan, tunggu izin user untuk lanjut ke Fase 2.

Jika kamu sudah paham, silakan sampaikan ringkasan pemahamanmu dan tanyakan kesiapan saya untuk kita mulai mengeksekusi **Fase 1: Fondasi Proyek, UI/UX, & Semua Halaman (Dummy Data)**!
```
