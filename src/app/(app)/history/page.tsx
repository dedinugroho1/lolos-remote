import type { Metadata } from "next";
import { HistoryView } from "@/components/history/history-view";
import { listApplications } from "@/lib/data/queries";
import { readSessionId } from "@/lib/session";

export const metadata: Metadata = { title: "Riwayat Lamaran" };

export default async function HistoryPage() {
  const sessionId = await readSessionId();
  const applications = sessionId ? await listApplications(sessionId) : [];
  return <HistoryView applications={applications} />;
}
