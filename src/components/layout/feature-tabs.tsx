"use client";

import { motion } from "framer-motion";
import { FileSearch, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Feature = {
  id: "cv-matcher" | "audit-kontrak";
  href: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
};

const features: Feature[] = [
  { id: "cv-matcher", href: "/", label: "CV Matcher", icon: FileSearch },
  { id: "audit-kontrak", href: "/kontrak", label: "Audit Kontrak", icon: ShieldCheck, isNew: true },
];

/** Rute yang termasuk alur CV Matcher (halaman utama + halaman aplikasi CV). */
const CV_MATCHER_PREFIXES = ["/upload", "/check", "/history", "/profil-saya"];

const matchesPrefix = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

export function isContractPath(pathname: string) {
  return matchesPrefix(pathname, "/kontrak");
}

export function activeFeature(pathname: string): Feature["id"] | null {
  if (isContractPath(pathname)) return "audit-kontrak";
  if (pathname === "/" || CV_MATCHER_PREFIXES.some((p) => matchesPrefix(pathname, p))) return "cv-matcher";
  return null; // halaman informasi (Tentang, FAQ, ...) — tidak ada tab aktif
}

/** Baris tab pemilih fitur di bawah header. Dipakai di header marketing & aplikasi. */
export function FeatureTabs({ className }: { className?: string }) {
  const pathname = usePathname();
  const active = activeFeature(pathname);

  return (
    <nav aria-label="Pilih fitur" className={cn("mx-auto flex h-11 max-w-6xl items-stretch px-4 sm:px-6", className)}>
      <ul className="flex w-full items-stretch gap-1 sm:w-auto">
        {features.map(({ id, href, label, icon: Icon, isNew }) => {
          const isActive = active === id;
          return (
            <li key={id} className="relative flex flex-1 sm:flex-none">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "my-1.5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  isActive && "text-primary hover:bg-primary/[0.06] hover:text-primary",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{label}</span>
                {isNew && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-px text-[10px] font-bold tracking-wide text-primary uppercase">
                    Baru
                  </span>
                )}
              </Link>
              {isActive && (
                <motion.span
                  layoutId="feature-tab-active"
                  aria-hidden
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
