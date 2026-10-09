import type { Application, ApplicationStatus, MatchSnapshot } from "@/lib/schemas/application";
import { dummyMatchResult } from "./match-result";

type SeedInput = {
  id: string;
  daysAgo: number;
  status: ApplicationStatus;
  notes: string | null;
  snapshot: MatchSnapshot;
};

const seeds: SeedInput[] = [
  {
    id: "a1f6c2d0-6b1e-4c1a-9e1a-2f7d1b9c0001",
    daysAgo: 2,
    status: "applied",
    notes: "Apply lewat portal Workable. Recruiter: Sofie (Amsterdam). Follow-up kalau belum ada kabar dalam 7 hari.",
    snapshot: {
      ...dummyMatchResult,
      job_info: { ...dummyMatchResult.job_info, job_title: "Frontend Engineer (Remote)", location_requirement: "Worldwide" },
      job_url: "https://careers.northwindlabs.example/frontend-engineer",
    },
  },
  {
    id: "a1f6c2d0-6b1e-4c1a-9e1a-2f7d1b9c0002",
    daysAgo: 9,
    status: "interview",
    notes: "Interview teknis tahap 1 hari Kamis 14.00 WIB via Google Meet. Siapkan studi kasus migrasi Next.js.",
    snapshot: {
      fit_score: 62,
      summary:
        "Pengalaman React Anda relevan, namun lowongan ini menekankan animasi kompleks dan React Native yang belum terlihat di CV. Domain agensi kreatif juga berbeda dari latar SaaS Anda.",
      score_breakdown: {
        technical_skills: 26,
        experience_seniority: 12,
        domain_project: 9,
        nice_to_have: 8,
        language_communication: 7,
      },
      job_info: {
        job_title: "React Developer",
        company_name: "Kreativa Studio",
        location_requirement: "Asia Pacific Only",
        timezone_overlap: "Overlap penuh (UTC+7 s.d. UTC+10)",
        contract_type: "Contract 6 bulan (bisa diperpanjang)",
        salary_range: "USD 2.500 - 3.200/bulan",
      },
      matched: ["React", "TypeScript", "Tailwind CSS", "Figma", "Komunikasi asinkron"],
      gaps: [
        "Belum ada pengalaman React Native",
        "Belum ada portofolio animasi GSAP / Framer Motion",
        "Belum ada pengalaman di agensi kreatif",
      ],
      mandatory_warnings: ["Lowongan hanya menerima kandidat yang berdomisili di Asia Pasifik — Indonesia termasuk."],
      job_url: "https://kreativa.example/jobs/react-developer",
    },
  },
  {
    id: "a1f6c2d0-6b1e-4c1a-9e1a-2f7d1b9c0003",
    daysAgo: 21,
    status: "offer",
    notes: "Offer diterima via email! Negosiasi start date awal bulan depan. Kontrak via Deel.",
    snapshot: {
      fit_score: 85,
      summary:
        "Kombinasi Next.js, Node.js, dan PostgreSQL di CV Anda sangat sesuai dengan kebutuhan tim payment PayFlow. Pengalaman di domain fintech menjadi nilai tambah yang kuat.",
      score_breakdown: {
        technical_skills: 35,
        experience_seniority: 17,
        domain_project: 14,
        nice_to_have: 11,
        language_communication: 8,
      },
      job_info: {
        job_title: "Fullstack Engineer",
        company_name: "PayFlow Inc",
        location_requirement: "Worldwide",
        timezone_overlap: "3 jam dengan UTC+0",
        contract_type: "Full-time (via Deel)",
        salary_range: "USD 5.000 - 7.000/bulan",
      },
      matched: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "React Query", "Fintech", "English proficiency"],
      gaps: ["Belum ada pengalaman dengan Stripe API secara langsung"],
      mandatory_warnings: [],
      job_url: null,
    },
  },
  {
    id: "a1f6c2d0-6b1e-4c1a-9e1a-2f7d1b9c0004",
    daysAgo: 30,
    status: "rejected",
    notes: "Ditolak otomatis karena syarat domisili AS. Pelajaran: cek syarat lokasi dulu sebelum apply.",
    snapshot: {
      fit_score: 41,
      summary:
        "Lowongan ini mensyaratkan domisili di Amerika Serikat dan pengalaman kepatuhan HIPAA. Skill UI Anda relevan, tetapi beberapa syarat wajib belum terpenuhi.",
      score_breakdown: {
        technical_skills: 18,
        experience_seniority: 10,
        domain_project: 4,
        nice_to_have: 5,
        language_communication: 4,
      },
      job_info: {
        job_title: "UI Engineer",
        company_name: "Orbit Health",
        location_requirement: "US Only",
        timezone_overlap: "Jam kerja penuh EST (UTC-5)",
        contract_type: "Full-time W-2",
        salary_range: "USD 120.000 - 140.000/tahun",
      },
      matched: ["React", "TypeScript", "Figma"],
      gaps: [
        "Belum ada pengalaman di domain kesehatan (HIPAA)",
        "Belum ada pengalaman dengan Vue.js",
        "Belum ada pengalaman aksesibilitas WCAG 2.1 AA yang terdokumentasi",
      ],
      mandatory_warnings: [
        "Lowongan hanya menerima kandidat berdomisili di Amerika Serikat (US Only).",
        "Jam kerja penuh EST berarti bekerja malam hingga dini hari WIB.",
      ],
      job_url: "https://orbithealth.example/careers/ui-engineer",
    },
  },
  {
    id: "a1f6c2d0-6b1e-4c1a-9e1a-2f7d1b9c0005",
    daysAgo: 0,
    status: "applied",
    notes: null,
    snapshot: {
      fit_score: 71,
      summary:
        "Stack yang diminta (React, Next.js, Tailwind) hampir seluruhnya ada di CV Anda. Lowongan ini meminta overlap 4 jam dengan zona Eropa dan pengalaman Shopify yang belum terlihat.",
      score_breakdown: {
        technical_skills: 30,
        experience_seniority: 14,
        domain_project: 10,
        nice_to_have: 9,
        language_communication: 8,
      },
      job_info: {
        job_title: "Frontend Contractor",
        company_name: "Kopi Remotes",
        location_requirement: "Europe Overlap 4 Jam",
        timezone_overlap: "4 jam dengan CET (≈ 14.00 - 18.00 WIB)",
        contract_type: "Contract (part-time 30 jam/minggu)",
        salary_range: "EUR 35 - 45/jam",
      },
      matched: ["React", "Next.js", "Tailwind CSS", "E-commerce", "English proficiency"],
      gaps: ["Belum ada pengalaman dengan Shopify Hydrogen", "Belum ada pengalaman dengan Sanity CMS"],
      mandatory_warnings: ["Lowongan meminta overlap minimal 4 jam dengan CET; konfirmasi ketersediaan jam kerja Anda."],
      job_url: null,
    },
  },
];

/** Membuat 5 baris contoh `saved_applications` relatif terhadap waktu sekarang. */
export function buildDummyApplications(now: Date = new Date()): Application[] {
  return seeds.map(({ id, daysAgo, status, notes, snapshot }) => {
    const appliedAt = new Date(now.getTime() - daysAgo * 86_400_000 - 3 * 3_600_000).toISOString();
    return {
      id,
      jobTitle: snapshot.job_info.job_title,
      companyName: snapshot.job_info.company_name,
      fitScore: snapshot.fit_score,
      locationRequirement: snapshot.job_info.location_requirement,
      timezoneOverlap: snapshot.job_info.timezone_overlap,
      contractType: snapshot.job_info.contract_type,
      salaryRange: snapshot.job_info.salary_range,
      matchResultJson: snapshot,
      matchedSkills: snapshot.matched,
      gaps: snapshot.gaps,
      mandatoryWarnings: snapshot.mandatory_warnings,
      status,
      notes,
      appliedAt,
      updatedAt: appliedAt,
    };
  });
}
