"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, CircleDashed } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const LIMIT = 6;

function ExpandableList<T extends string>({
  items,
  render,
  emptyText,
  className,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  emptyText: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, LIMIT);
  if (items.length === 0) return <p className="text-sm text-muted-foreground italic">{emptyText}</p>;
  return (
    <motion.div layout className="space-y-3">
      <motion.ul layout className={className}>
        <AnimatePresence initial={false}>
          {visible.map((item) => (
            <motion.li
              key={item}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {render(item)}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {items.length > LIMIT && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="text-muted-foreground"
        >
          {expanded ? "Tampilkan lebih sedikit" : `Lihat ${items.length - LIMIT} lainnya`}
          <ChevronDown className={expanded ? "rotate-180 transition-transform" : "transition-transform"} />
        </Button>
      )}
    </motion.div>
  );
}

export function MatchedGaps({ matched, gaps }: { matched: string[]; gaps: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section aria-labelledby="matched-title" className="rounded-2xl border bg-card p-5 shadow-sm">
        <header className="flex items-center justify-between">
          <h3 id="matched-title" className="flex items-center gap-2 text-sm font-bold">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
            </span>
            Sudah Cocok
          </h3>
          <span className="font-mono text-xs font-semibold text-muted-foreground">{matched.length}</span>
        </header>
        <div className="mt-4">
          <ExpandableList
            items={matched}
            emptyText="Belum ada kecocokan yang terdeteksi."
            className="flex flex-wrap gap-2"
            render={(m) => (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <Check className="size-3" strokeWidth={3} aria-hidden />
                {m}
              </span>
            )}
          />
        </div>
      </section>

      <section aria-labelledby="gaps-title" className="rounded-2xl border bg-card p-5 shadow-sm">
        <header className="flex items-center justify-between">
          <h3 id="gaps-title" className="flex items-center gap-2 text-sm font-bold">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-warning/15 text-amber-600 dark:text-amber-300">
              <CircleDashed className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            Celah (Gaps)
          </h3>
          <span className="font-mono text-xs font-semibold text-muted-foreground">{gaps.length}</span>
        </header>
        <div className="mt-4">
          <ExpandableList
            items={gaps}
            emptyText="Tidak ada celah berarti yang terdeteksi."
            className="space-y-2"
            render={(g) => (
              <span className="flex items-start gap-2.5 rounded-xl bg-muted/60 px-3 py-2 text-sm leading-snug">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" aria-hidden />
                {g}
              </span>
            )}
          />
        </div>
      </section>
    </div>
  );
}
