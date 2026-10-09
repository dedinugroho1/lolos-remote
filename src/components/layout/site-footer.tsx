import { Lock, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLinks = [
  {
    title: "Produk",
    links: [
      { href: "/upload", label: "Unggah CV" },
      { href: "/check", label: "Cek Kecocokan" },
      { href: "/history", label: "Riwayat Lamaran" },
      { href: "/profil-saya", label: "Profil Saya" },
      { href: "/kontrak", label: "Audit Kontrak" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { href: "/tentang", label: "Tentang LolosRemote" },
      { href: "/faq", label: "Tanya Jawab" },
      { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
    ],
  },
];

const commitments = [
  { icon: Lock, text: "File PDF tidak disimpan — hanya ringkasan profil." },
  { icon: ShieldCheck, text: "Tanpa akun, tanpa email, tanpa nomor HP." },
  { icon: Trash2, text: "Hapus semua data Anda kapan saja dengan 1 tombol." },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Cek kecocokan CV dengan lowongan remote dalam hitungan detik, lalu catat lamaran Anda di satu tempat.
            Gratis, tanpa daftar akun.
          </p>
          <ul className="space-y-2">
            {commitments.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Icon className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title}>
            <h2 className="text-sm font-bold">{group.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} LolosRemote. Dibuat untuk pencari kerja remote Indonesia.</p>
          <p>
            Ditenagai <span className="font-mono font-semibold text-foreground">Claude AI</span> · Data tersimpan di
            Neon PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
