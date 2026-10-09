import type { CvProfile } from "@/lib/schemas/cv-profile";

/** Contoh profil hasil parse CV (PRD Bab 9). */
export const dummyCvProfile: CvProfile = {
  summary:
    "Frontend Engineer dengan 4 tahun pengalaman membangun aplikasi web SaaS menggunakan React dan Next.js. Terbiasa bekerja remote dengan tim lintas zona waktu.",
  seniority_level: "mid",
  technical_skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "React Query",
    "Node.js",
    "PostgreSQL",
    "Playwright",
    "Figma",
  ],
  soft_skills: ["Komunikasi asinkron", "Dokumentasi teknikal", "Code review"],
  experiences: [
    {
      title: "Frontend Engineer",
      company: "Kopi Digital Indonesia",
      duration: "Jan 2022 - Sekarang",
      highlights: [
        "Memimpin migrasi aplikasi internal dari CRA ke Next.js 14 App Router, menurunkan LCP 42%.",
        "Membangun design system internal yang dipakai 6 tim produk.",
      ],
    },
    {
      title: "Junior Web Developer",
      company: "Startup Lokal Nusantara",
      duration: "Agu 2020 - Des 2021",
      highlights: [
        "Mengembangkan landing page dan dashboard CMS dengan React dan Vite.",
        "Menulis 120+ komponen reusable dengan Storybook.",
      ],
    },
  ],
  languages: [
    { name: "Bahasa Indonesia", proficiency: "Native" },
    { name: "English", proficiency: "Professional Working Proficiency" },
  ],
  domains: ["SaaS B2B", "E-commerce", "Fintech"],
};
