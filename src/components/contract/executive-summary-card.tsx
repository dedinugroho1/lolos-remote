import { Banknote, Briefcase, Building2, Clock, FileText, Scale } from "lucide-react";
import type { ContractAudit } from "@/lib/schemas/contract-audit";

const profileFields: { key: keyof ContractAudit["contract_profile"]; label: string; icon: typeof FileText }[] = [
  { key: "contract_type", label: "Jenis kontrak", icon: FileText },
  { key: "employer", label: "Pemberi kerja", icon: Building2 },
  { key: "role", label: "Posisi", icon: Briefcase },
  { key: "compensation", label: "Kompensasi", icon: Banknote },
  { key: "working_hours", label: "Jam kerja", icon: Clock },
  { key: "governing_law", label: "Hukum yang berlaku", icon: Scale },
];

export function ExecutiveSummaryCard({ audit }: { audit: ContractAudit }) {
  return (
    <section aria-labelledby="executive-summary-title" className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm">
      <h2 id="executive-summary-title" className="text-sm font-semibold text-muted-foreground">
        Ringkasan Eksekutif
      </h2>
      {audit.contract_title && <p className="mt-2 text-lg font-bold leading-snug">{audit.contract_title}</p>}
      <p className="mt-3 leading-relaxed text-foreground/90">{audit.executive_summary}</p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {profileFields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex gap-3 rounded-xl bg-muted/50 px-3.5 py-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium break-words">{audit.contract_profile[key] || "Tidak disebutkan"}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
