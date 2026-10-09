import type { ApplicationStatus } from "@/lib/schemas/application";

export const statusMeta: Record<ApplicationStatus, { label: string; className: string; dot: string }> = {
  applied: {
    label: "Applied",
    className: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  interview: {
    label: "Interview",
    className: "bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  offer: {
    label: "Offer",
    className: "bg-success/10 text-success border-success/25",
    dot: "bg-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger/10 text-danger border-danger/20",
    dot: "bg-danger",
  },
  ghosted: {
    label: "Ghosted",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

/** Urutan alur status untuk stepper di halaman detail. */
export const statusFlow: ApplicationStatus[] = ["applied", "interview", "offer"];
