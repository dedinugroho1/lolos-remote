import { FadeIn } from "@/components/motion/fade-in";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-grid relative -mt-16 overflow-hidden pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      <FadeIn className="relative mx-auto max-w-3xl px-4 pt-16 pb-14 text-center sm:px-6 md:pt-20">
        <p className="text-sm font-bold tracking-wide text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">{title}</h1>
        {description && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>}
        {children}
      </FadeIn>
    </section>
  );
}
