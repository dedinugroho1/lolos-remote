import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat halaman">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-10 w-80 max-w-full" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
