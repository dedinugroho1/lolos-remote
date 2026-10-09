import type { Metadata } from "next";
import { UploadFlow } from "@/components/upload/upload-flow";
import { getCurrentCv } from "@/lib/data/current";

export const metadata: Metadata = { title: "Unggah CV" };

const notices: Record<string, string> = {
  check: "Unggah CV dulu sebelum mengecek lowongan.",
};

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const [cv, { from }] = await Promise.all([getCurrentCv(), searchParams]);
  return <UploadFlow initialCv={cv} notice={from ? notices[from] : undefined} />;
}
