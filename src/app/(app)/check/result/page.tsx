import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResultView } from "@/components/result/result-view";
import { getCurrentCv } from "@/lib/data/current";

export const metadata: Metadata = { title: "Hasil Analisis" };

export default async function ResultPage() {
  if (!(await getCurrentCv())) redirect("/upload?from=check");
  return <ResultView />;
}
