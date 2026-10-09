import { Briefcase, Code2, Languages, Layers, MessagesSquare, UserRound } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { seniorityLabel } from "@/lib/format";
import type { CvProfile } from "@/lib/schemas/cv-profile";

function Block({ icon: Icon, title, count, children }: { icon: typeof Code2; title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-4" aria-hidden />
        </span>
        {title}
        {count !== undefined && <span className="ml-auto font-mono text-xs font-semibold text-muted-foreground">{count}</span>}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Preview profil CV hasil parse (kartu ringkasan + tag skill + timeline pengalaman). */
export function ProfilePreview({ profile }: { profile: CvProfile }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="space-y-5">
        <FadeIn>
          <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
            <div aria-hidden className="bg-gradient-brand absolute inset-x-0 top-0 h-1" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <UserRound className="size-3.5" aria-hidden />
                {seniorityLabel[profile.seniority_level]}
              </span>
              {profile.domains.map((d) => (
                <span key={d} className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
            <h3 className="mt-4 text-sm font-bold text-muted-foreground">Ringkasan Profil</h3>
            <p className="mt-1.5 leading-relaxed">{profile.summary}</p>
          </section>
        </FadeIn>

        <FadeIn delay={0.06}>
          <Block icon={Briefcase} title="Pengalaman" count={profile.experiences.length}>
            <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
              {profile.experiences.map((exp, i) => (
                <li key={`${exp.company}-${i}`} className="relative">
                  <span
                    aria-hidden
                    className={
                      "absolute top-1 -left-[31px] size-3.5 rounded-full border-2 border-card " +
                      (i === 0 ? "bg-primary ring-4 ring-primary/15" : "bg-muted-foreground/40")
                    }
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="font-semibold">{exp.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">{exp.duration}</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{exp.company}</p>
                  {exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </Block>
        </FadeIn>
      </div>

      <div className="space-y-5">
        <FadeIn delay={0.1}>
          <Block icon={Code2} title="Skill Teknis" count={profile.technical_skills.length}>
            <ul className="flex flex-wrap gap-2">
              {profile.technical_skills.map((s) => (
                <li key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        </FadeIn>
        <FadeIn delay={0.14}>
          <Block icon={MessagesSquare} title="Soft Skill" count={profile.soft_skills.length}>
            <ul className="flex flex-wrap gap-2">
              {profile.soft_skills.map((s) => (
                <li key={s} className="rounded-full border px-3 py-1 text-xs font-medium">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        </FadeIn>
        <FadeIn delay={0.18}>
          <Block icon={Languages} title="Bahasa">
            <ul className="space-y-2.5">
              {profile.languages.map((l) => (
                <li key={l.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-right text-xs text-muted-foreground">{l.proficiency}</span>
                </li>
              ))}
            </ul>
          </Block>
        </FadeIn>
        <FadeIn delay={0.22}>
          <Block icon={Layers} title="Domain Proyek" count={profile.domains.length}>
            <ul className="flex flex-wrap gap-2">
              {profile.domains.map((d) => (
                <li key={d} className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {d}
                </li>
              ))}
            </ul>
          </Block>
        </FadeIn>
      </div>
    </div>
  );
}
