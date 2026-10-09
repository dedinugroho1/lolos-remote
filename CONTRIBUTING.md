# Panduan Kontribusi

Terima kasih sudah tertarik berkontribusi ke **LolosRemote**! 🎉
Semua bentuk kontribusi dihargai, mulai dari laporan bug, ide fitur, perbaikan teks, sampai kode.

## 🐛 Melaporkan bug / mengusulkan fitur

1. Cek dulu [daftar issue](https://github.com/dedinugroho1/lolos-remote/issues) agar tidak duplikat.
2. Buat issue baru dan sertakan:
   - langkah untuk mereproduksi (untuk bug),
   - perilaku yang diharapkan vs yang terjadi,
   - screenshot atau log error bila ada.
3. **Jangan** menempelkan CV asli, API key, atau `DATABASE_URL` di issue.

> 🔐 Celah keamanan mohon dilaporkan secara privat lewat
> [GitHub Security Advisories](https://github.com/dedinugroho1/lolos-remote/security/advisories/new).

## 💻 Mengirim pull request

1. **Fork** repo ini, lalu buat branch dari `main`:
   ```bash
   git checkout -b fitur/nama-fitur
   ```
2. Ikuti langkah setup di [README](README.md#-coba-di-komputer-anda).
3. Buat perubahan, lalu pastikan semua pemeriksaan lolos:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
4. Jika mengubah skema database (`src/db/schema.ts`), buat file migrasi:
   ```bash
   npm run db:generate
   ```
5. Commit dengan pesan yang jelas (disarankan gaya [Conventional Commits](https://www.conventionalcommits.org/id/), mis. `feat: ...`, `fix: ...`, `docs: ...`).
6. Push dan buka pull request ke `main`. Jelaskan **apa** yang diubah dan **kenapa**, sertakan screenshot untuk perubahan UI.

## 🎨 Konvensi kode

- **TypeScript strict.** Hindari `any`; gunakan tipe dari Zod (`z.infer`) dan SDK.
- **Validasi.** Setiap Route Handler wajib memvalidasi input dengan Zod, dan setiap query data pengguna **wajib** difilter `user_session_id`.
- **Rahasia di server.** API key tidak boleh memakai prefix `NEXT_PUBLIC_` atau diimpor di komponen client.
- **UI.** Ikuti design system yang ada (token warna di `globals.css`, komponen `src/components/ui`, ikon Lucide).
- **Bahasa.** Teks antarmuka memakai Bahasa Indonesia yang profesional dan hangat (sapaan "Anda"). Hasil AI harus netral dan tidak menyuruh pengguna "apply" atau "skip".

## 📄 Lisensi

Dengan berkontribusi, Anda setuju kontribusi Anda dirilis di bawah [MIT License](LICENSE) proyek ini.
