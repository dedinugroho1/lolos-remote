import { ShieldCheck, TriangleAlert } from "lucide-react";

export function WarningsBanner({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success/[0.06] p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Tidak ada syarat wajib yang mengganjal</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            AI tidak menemukan syarat lokasi, zona waktu, atau skill wajib yang jelas-jelas belum terpenuhi.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div role="alert" className="rounded-2xl border border-warning/40 bg-warning/[0.08] p-4">
      <div className="flex items-center gap-2">
        <TriangleAlert className="size-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden />
        <p className="text-sm font-bold">Perhatikan Syarat Wajib ({warnings.length})</p>
      </div>
      <ul className="mt-3 space-y-2 pl-7">
        {warnings.map((w) => (
          <li key={w} className="list-disc text-sm leading-relaxed text-foreground/90 marker:text-warning">
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
