import { z } from "zod";

export const cvProfileSchema = z.object({
  summary: z.string().min(20).max(1500),
  seniority_level: z.enum(["fresh_graduate", "junior", "mid", "senior", "lead"]),
  technical_skills: z.array(z.string()).min(3).max(60),
  soft_skills: z.array(z.string()).max(20),
  experiences: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        duration: z.string(),
        highlights: z.array(z.string()).max(6),
      }),
    )
    .max(15),
  languages: z.array(
    z.object({
      name: z.string(),
      proficiency: z.string(),
    }),
  ),
  domains: z.array(z.string()).max(15),
});
export type CvProfile = z.infer<typeof cvProfileSchema>;
export type SeniorityLevel = CvProfile["seniority_level"];
