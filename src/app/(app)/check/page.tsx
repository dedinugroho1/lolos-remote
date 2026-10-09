import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckForm } from "@/components/check/check-form";
import { getCurrentCv } from "@/lib/data/current";

export const metadata: Metadata = { title: "Cek Kecocokan" };

export default async function CheckPage() {
  const cv = await getCurrentCv();
  // PRD Bab 5: tanpa CV tersimpan → redirect ke /upload.
  if (!cv) redirect("/upload?from=check");
  return <CheckForm cv={cv} />;
}
