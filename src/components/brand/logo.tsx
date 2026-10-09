import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-gradient-brand relative inline-flex size-8 items-center justify-center rounded-xl text-white shadow-sm shadow-primary/30",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" strokeWidth={2.4} stroke="currentColor">
        <circle cx="12" cy="12" r="8" strokeOpacity={0.45} />
        <path d="M12 4a8 8 0 0 1 8 8" strokeLinecap="round" />
        <path d="m8.5 12.2 2.3 2.3 4.7-4.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Logo({ href = "/", className, compact = false }: { href?: string; className?: string; compact?: boolean }) {
  return (
    <Link
      href={href}
      aria-label="LolosRemote — kembali ke beranda"
      className={cn("group inline-flex items-center gap-2.5 rounded-xl", className)}
    >
      <LogoMark className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105" />
      <span className={cn("font-heading text-lg font-extrabold tracking-tight", compact && "max-sm:sr-only")}>
        Lolos<span className="text-primary">Remote</span>
      </span>
    </Link>
  );
}
