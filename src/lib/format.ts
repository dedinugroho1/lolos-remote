const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const relativeFormatter = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 1) return "baru saja";
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, "day");
  const months = Math.round(days / 30);
  return relativeFormatter.format(months, "month");
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export const seniorityLabel: Record<string, string> = {
  fresh_graduate: "Fresh Graduate",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead / Principal",
};
