"use client";

import { MessageCircleQuestion, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FaqCategory } from "@/lib/content/faq";
import { cn } from "@/lib/utils";

export function FaqExplorer({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => active === "semua" || c.id === active)
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, query, active]);

  const total = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan, misalnya: ukuran PDF, hapus data, model AI…"
            aria-label="Cari pertanyaan"
            className="h-12 pl-11 text-base shadow-sm"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Hapus pencarian"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              <X />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {[{ id: "semua", title: "Semua" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              aria-pressed={active === c.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5",
                active === c.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
          <MessageCircleQuestion className="mx-auto size-10 text-muted-foreground/60" aria-hidden />
          <p className="mt-3 font-semibold">Belum ada jawaban untuk &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">Coba kata kunci lain, misalnya &ldquo;cookie&rdquo; atau &ldquo;skor&rdquo;.</p>
        </div>
      ) : (
        filtered.map((c) => (
          <section key={c.id} aria-labelledby={`faq-${c.id}`}>
            <h2 id={`faq-${c.id}`} className="mb-3 text-lg font-bold">
              {c.title}
            </h2>
            <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5 shadow-sm">
              {c.items.map((item, i) => (
                <AccordionItem key={item.q} value={`${c.id}-${i}`}>
                  <AccordionTrigger className="py-4 text-left text-[0.95rem] font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))
      )}
    </div>
  );
}
