export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "privasi",
    title: "Privasi CV",
    items: [
      {
        q: "Apakah file PDF CV saya disimpan di server?",
        a: "Tidak. File PDF hanya dibaca sekali oleh AI lalu dibuang. Yang kami simpan hanyalah ringkasan profil terstruktur (skill, pengalaman, bahasa) dalam format JSON di database Neon PostgreSQL.",
      },
      {
        q: "Siapa saja yang bisa melihat data saya?",
        a: "Hanya Anda, dari perangkat dan browser yang sama. Setiap pengunjung mendapat ID sesi anonim acak yang disimpan di cookie. Data CV dan riwayat lamaran hanya bisa diakses oleh request yang membawa ID sesi tersebut.",
      },
      {
        q: "Apakah lowongan yang saya cek ikut tersimpan?",
        a: "Tidak, kecuali Anda menekan tombol \"Tandai Sudah Apply\". Lowongan yang Anda lewati tidak disimpan sama sekali.",
      },
      {
        q: "Apakah data saya dipakai untuk melatih AI?",
        a: "Tidak. Kami memakai Claude API dari Anthropic untuk komersial, yang secara default tidak menggunakan data input API untuk melatih model.",
      },
    ],
  },
  {
    id: "unggah",
    title: "Unggah CV",
    items: [
      {
        q: "Format dan ukuran file apa yang didukung?",
        a: "Saat ini hanya PDF dengan ukuran maksimal 5MB. Jika CV Anda berbentuk Word atau Google Docs, ekspor dulu ke PDF.",
      },
      {
        q: "Bahasa CV apa yang bisa dibaca?",
        a: "Bahasa Indonesia dan Bahasa Inggris. CV dengan bahasa lain belum didukung di versi awal ini.",
      },
      {
        q: "Bagaimana cara memperbarui CV?",
        a: "Buka halaman Unggah CV lalu klik \"Perbarui CV\". CV baru akan menimpa versi lama — hanya ada 1 CV aktif per perangkat.",
      },
      {
        q: "Berapa lama proses membaca CV?",
        a: "Umumnya kurang dari 30 detik. Jika AI sedang sibuk, sistem akan mencoba ulang otomatis satu kali.",
      },
    ],
  },
  {
    id: "ai",
    title: "Model AI & Skor",
    items: [
      {
        q: "Model AI apa yang dipakai?",
        a: "LolosRemote memakai Claude dari Anthropic. Model default adalah Claude Haiku 5.5 yang cepat dan hemat, dengan model cadangan Claude Sonnet 5.5 jika model utama sedang padat.",
      },
      {
        q: "Bagaimana skor 0-100 dihitung?",
        a: "Skor adalah penjumlahan 5 kategori dengan bobot terkunci: Skill Teknis Wajib (40), Pengalaman & Senioritas (20), Domain Proyek (15), Nice-to-have Skill (15), dan Bahasa/Komunikasi (10).",
      },
      {
        q: "Apakah skor tinggi menjamin saya diterima?",
        a: "Tidak. Skor adalah alat bantu untuk menyaring lowongan, bukan prediksi hasil rekrutmen. AI sengaja dibuat netral dan tidak akan menyuruh Anda apply atau skip.",
      },
      {
        q: "Kenapa info gaji atau zona waktu tertulis \"Tidak disebutkan\"?",
        a: "Artinya Job Description yang Anda tempel memang tidak mencantumkan informasi tersebut. AI tidak mengarang data yang tidak ada.",
      },
    ],
  },
  {
    id: "sesi",
    title: "Sesi & Reset",
    items: [
      {
        q: "Kenapa tidak perlu login?",
        a: "Agar Anda bisa langsung mencoba tanpa ribet. Sebagai gantinya, kami memakai cookie sesi anonim bernama lolosremote_session yang berlaku 30 hari.",
      },
      {
        q: "Data saya hilang setelah ganti browser. Kenapa?",
        a: "Karena sesi terikat pada cookie di browser tersebut. Jika Anda membuka dari browser/perangkat lain atau menghapus cookie, Anda dianggap pengunjung baru.",
      },
      {
        q: "Bagaimana cara menghapus semua data saya?",
        a: "Buka halaman Profil Saya lalu klik \"Hapus Semua Data Saya\". Profil CV, seluruh riwayat lamaran, dan cookie sesi akan dihapus permanen setelah konfirmasi dua langkah.",
      },
    ],
  },
];
