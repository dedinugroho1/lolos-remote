"use client";

import { FileSearch, History, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { CvStatusIndicator, type CvIndicatorData } from "@/components/layout/cv-status-indicator";
import { FeatureTabs, isContractPath } from "@/components/layout/feature-tabs";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/check", label: "Cek Lowongan", icon: FileSearch },
  { href: "/history", label: "Riwayat Lamaran", icon: History },
  { href: "/profil-saya", label: "Profil Saya", icon: UserRound },
];

export function AppHeader({ cv }: { cv: CvIndicatorData }) {
  const pathname = usePathname();
  // Indikator CV & sub-navigasi di bawah ini khusus alur CV Matcher.
  const showCvNav = !isContractPath(pathname);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo compact />
          {showCvNav && <CvStatusIndicator cv={cv} />}
        </div>
        <nav aria-label="Navigasi aplikasi" className="flex items-center gap-0.5">
          {showCvNav && links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-xl px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:px-3",
                  active && "bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            );
          })}
          {showCvNav && <span className="mx-1 h-5 w-px bg-border" aria-hidden />}
          <ThemeToggle />
        </nav>
      </div>
      <div className="border-t border-border/60">
        <FeatureTabs />
      </div>
    </header>
  );
}
