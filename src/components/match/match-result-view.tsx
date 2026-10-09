import { CriticalInfoGrid } from "@/components/match/critical-info-grid";
import { MatchedGaps } from "@/components/match/matched-gaps";
import { ScoreOverview } from "@/components/match/score-overview";
import { WarningsBanner } from "@/components/match/warnings-banner";
import { FadeIn } from "@/components/motion/fade-in";
import type { JobMatchResult } from "@/lib/schemas/job-match";

/**
 * Layout hasil analisis (PRD Bab 7 — Result Layout):
 * kiri = ring + breakdown, kanan = info kritis + matched/gaps + warning.
 */
export function MatchResultView({ result }: { result: JobMatchResult }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <FadeIn className="lg:sticky lg:top-32">
        <ScoreOverview result={result} />
      </FadeIn>
      <div className="space-y-6">
        <FadeIn delay={0.08}>
          <WarningsBanner warnings={result.mandatory_warnings} />
        </FadeIn>
        <FadeIn delay={0.14}>
          <section aria-labelledby="info-title" className="space-y-3">
            <h2 id="info-title" className="text-base font-bold">
              Info Kritis Lowongan
            </h2>
            <CriticalInfoGrid info={result.job_info} />
          </section>
        </FadeIn>
        <FadeIn delay={0.2}>
          <section aria-labelledby="mg-title" className="space-y-3">
            <h2 id="mg-title" className="text-base font-bold">
              Matched vs Gaps
            </h2>
            <MatchedGaps matched={result.matched} gaps={result.gaps} />
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
