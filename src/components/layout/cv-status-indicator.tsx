"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelative } from "@/lib/format";

export type CvIndicatorData = { originalFileName: string | null; updatedAt: string } | null;

export function CvStatusIndicator({ cv }: { cv: CvIndicatorData }) {
  if (!cv) {
    return (
      <Link
        href="/upload"
        className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-warning/20 dark:text-amber-300"
      >
        <CircleAlert className="size-3.5" aria-hidden />
        Belum ada CV
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/profil-saya"
          aria-label="CV tersimpan — lihat profil saya"
          className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-success/20 dark:text-emerald-300"
        >
          <CircleCheck className="size-3.5" aria-hidden />
          <span className="max-sm:hidden">CV Tersimpan</span> ✓
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {cv.originalFileName ?? "CV"} · diperbarui {formatRelative(cv.updatedAt)}
      </TooltipContent>
    </Tooltip>
  );
}
