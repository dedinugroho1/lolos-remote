import { Clock3, FileSignature, MapPin, Wallet, type LucideIcon } from "lucide-react";
import type { JobMatchResult } from "@/lib/schemas/job-match";
import { cn } from "@/lib/utils";

type Info = JobMatchResult["job_info"];

const RESTRICTIVE = /(us|eu|europe|uk|americas?)\s*only|only\b/i;
const UNKNOWN = /tidak disebutkan/i;

export function CriticalInfoGrid({ info }: { info: Info }) {
  const items: { label: string; value: string; icon: LucideIcon; flag?: boolean }[] = [
    { label: "Syarat Lokasi", value: info.location_requirement, icon: MapPin, flag: RESTRICTIVE.test(info.location_requirement) },
    { label: "Zona Waktu / Overlap WIB", value: info.timezone_overlap, icon: Clock3 },
    { label: "Tipe Kontrak", value: info.contract_type, icon: FileSignature },
    { label: "Rentang Gaji", value: info.salary_range, icon: Wallet },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ label, value, icon: Icon, flag }) => {
        const unknown = !value || UNKNOWN.test(value);
        return (
          <div
            key={label}
            className={cn(
              "card-lift rounded-2xl border bg-card p-4 shadow-sm",
              flag && "border-danger/30 bg-danger/[0.04]",
            )}
          >
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground",
                  flag && "bg-danger/10 text-danger",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </div>
            <p className={cn("mt-2.5 text-sm leading-snug font-semibold", unknown && "font-medium text-muted-foreground italic")}>
              {value || "Tidak disebutkan"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
