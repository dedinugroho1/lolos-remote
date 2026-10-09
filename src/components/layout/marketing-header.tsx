"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { FeatureTabs } from "@/components/layout/feature-tabs";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-all duration-300",
        (scrolled || open) && "border-border bg-background/80 shadow-sm backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-primary hover:text-primary",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="marketing-nav-active"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/history"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Riwayat Lamaran
          </Link>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/upload" aria-label="Cek kecocokan CV sekarang">
              Cek Sekarang <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div className={cn("border-t border-border/60 transition-colors", !(scrolled || open) && "bg-background/60 backdrop-blur-md")}>
        <FeatureTabs />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Navigasi seluler"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pt-2 pb-4">
              {[...navItems, { href: "/history", label: "Riwayat Lamaran" }, { href: "/profil-saya", label: "Profil Saya" }].map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === item.href && "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <Button asChild size="lg" className="mt-2">
                <Link href="/upload">
                  Mulai Cek Sekarang <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
