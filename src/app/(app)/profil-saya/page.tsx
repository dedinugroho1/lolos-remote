import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { getCurrentCv } from "@/lib/data/current";
import { countContractAudits } from "@/lib/data/contract-queries";
import { countApplications } from "@/lib/data/queries";
import { readSessionId } from "@/lib/session";

export const metadata: Metadata = { title: "Profil Saya" };

export default async function ProfilSayaPage() {
  const sessionId = await readSessionId();
  const [cv, applicationCount, contractAuditCount] = await Promise.all([
    getCurrentCv(),
    sessionId ? countApplications(sessionId) : 0,
    sessionId ? countContractAudits(sessionId) : 0,
  ]);
  return <ProfileView cv={cv} applicationCount={applicationCount} contractAuditCount={contractAuditCount} />;
}
