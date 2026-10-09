import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import {
  CompanyStrip,
  FeaturesSection,
  FinalCta,
  HowItWorks,
  ProblemSection,
  ScoreDemoSection,
  TestimonialsSection,
} from "@/components/home/sections";

export const metadata: Metadata = {
  title: { absolute: "LolosRemote — Cek Kecocokan CV dengan Lowongan Remote dalam Hitungan Detik" },
  description:
    "Unggah CV sekali, tempel Job Description, dan dapatkan skor kecocokan 0-100 beserta syarat tersembunyi (US Only, zona waktu, skill wajib). Gratis, tanpa daftar akun.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CompanyStrip />
      <ProblemSection />
      <HowItWorks />
      <ScoreDemoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FinalCta />
    </>
  );
}
