import type { Metadata } from "next";
import { ApplicationDetail, ApplicationNotFound } from "@/components/history/application-detail";
import { getApplication } from "@/lib/data/queries";
import { applicationIdSchema } from "@/lib/schemas/application";
import { readSessionId } from "@/lib/session";

export const metadata: Metadata = { title: "Detail Lamaran" };

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, sessionId] = await Promise.all([params, readSessionId()]);
  const validId = applicationIdSchema.safeParse(id);
  // Hanya lamaran milik sesi sendiri yang bisa dibuka (PRD Bab 5).
  const application = sessionId && validId.success ? await getApplication(sessionId, validId.data) : null;
  if (!application) return <ApplicationNotFound />;
  return <ApplicationDetail application={application} />;
}
