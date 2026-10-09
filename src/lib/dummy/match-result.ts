import type { JobMatchResult } from "@/lib/schemas/job-match";

/** Contoh hasil analisis untuk rendering `/check/result` (PRD Bab 9). */
export const dummyMatchResult: JobMatchResult = {
  fit_score: 78,
  summary:
    "Profil Anda kuat di stack inti lowongan ini (React, Next.js, TypeScript) dan terbiasa bekerja remote lintas zona waktu. Celah utama ada pada GraphQL dan rekam jejak open-source yang diminta sebagai nilai plus.",
  score_breakdown: {
    technical_skills: 33,
    experience_seniority: 15,
    domain_project: 12,
    nice_to_have: 10,
    language_communication: 8,
  },
  job_info: {
    job_title: "Senior Frontend Engineer (Remote)",
    company_name: "Northwind Labs",
    location_requirement: "Worldwide (Europe preferred)",
    timezone_overlap: "4 jam dengan WIB",
    contract_type: "Full-time Independent Contractor",
    salary_range: "USD 4.000 - 6.000/bulan",
  },
  matched: ["React", "Next.js", "TypeScript", "Tailwind", "PostgreSQL", "English proficiency"],
  gaps: [
    "Belum ada pengalaman dengan GraphQL",
    "Belum ada kontribusi open-source yang ditonjolkan",
  ],
  mandatory_warnings: [
    "Lowongan meminta overlap minimal 4 jam dengan CET; konfirmasi ketersediaan jam kerja Anda.",
  ],
};

/** Contoh Job Description untuk tombol "Pakai contoh JD" di /check. */
export const sampleJobDescription = `Senior Frontend Engineer (Remote)
Company: Northwind Labs

About Northwind Labs
Northwind Labs builds collaborative analytics tools for B2B SaaS teams across Europe and Asia. We are a fully remote team of 40 people.

What you'll do
- Build and maintain our customer-facing dashboard with React, Next.js and TypeScript.
- Collaborate with designers in Figma to ship a consistent design system using Tailwind CSS.
- Work with our backend team on GraphQL APIs backed by PostgreSQL.

Requirements
- 5+ years of experience in frontend development.
- Strong knowledge of React, Next.js, TypeScript and modern CSS (Tailwind).
- Experience consuming GraphQL APIs.
- Fluent written and spoken English.

Nice to have
- Open-source contributions.
- Experience with Playwright or Cypress.

Location: Worldwide (Europe preferred). Must have at least 4 hours overlap with CET (UTC+1).
Contract: Full-time Independent Contractor
Salary: USD 4,000 - 6,000 / month`;
