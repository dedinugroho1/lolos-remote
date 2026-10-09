import { z } from "zod";

export const jobMatchSchema = z.object({
  fit_score: z.number().int().min(0).max(100),
  summary: z.string().min(20).max(1500),
  score_breakdown: z.object({
    technical_skills: z.number().min(0).max(40),
    experience_seniority: z.number().min(0).max(20),
    domain_project: z.number().min(0).max(15),
    nice_to_have: z.number().min(0).max(15),
    language_communication: z.number().min(0).max(10),
  }),
  job_info: z.object({
    job_title: z.string(),
    company_name: z.string(),
    location_requirement: z.string(),
    timezone_overlap: z.string(),
    contract_type: z.string(),
    salary_range: z.string(),
  }),
  matched: z.array(z.string()).max(40),
  gaps: z.array(z.string()).max(40),
  mandatory_warnings: z.array(z.string()).max(10),
});
export type JobMatchResult = z.infer<typeof jobMatchSchema>;
export type ScoreBreakdown = JobMatchResult["score_breakdown"];
