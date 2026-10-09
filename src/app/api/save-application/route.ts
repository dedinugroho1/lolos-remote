import { NextResponse } from "next/server";
import { HttpError, assertXhr, handle, readJson } from "@/lib/api/http";
import { getCvProfile, insertApplication } from "@/lib/data/queries";
import { sanitizeJobDescription } from "@/lib/sanitize";
import { saveApplicationRequestSchema } from "@/lib/schemas/application";
import { sumBreakdown } from "@/lib/score";
import { getSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/save-application — simpan lowongan yang ditandai "Sudah Apply". */
export const POST = handle("POST /api/save-application", async (req) => {
  assertXhr(req);
  const sessionId = getSessionId(req);
  if (!sessionId) throw new HttpError(401, "no_session", "Sesi Anda tidak ditemukan. Muat ulang halaman.");

  const body = await readJson(req, saveApplicationRequestSchema, 200 * 1024);
  if (!(await getCvProfile(sessionId))) throw new HttpError(409, "no_cv", "Unggah CV dulu sebelum menyimpan lamaran");

  const jobTitle = body.jobTitle.trim();
  const companyName = body.companyName.trim();
  const fitScore = Math.min(100, Math.max(0, sumBreakdown(body.result.score_breakdown)));
  const result = {
    ...body.result,
    fit_score: fitScore,
    job_info: { ...body.result.job_info, job_title: jobTitle, company_name: companyName },
  };
  const info = result.job_info;
  const orNull = (v: string) => (v.trim() ? v.trim() : null);

  const application = await insertApplication({
    userSessionId: sessionId,
    jobTitle,
    companyName,
    fitScore,
    locationRequirement: orNull(info.location_requirement),
    timezoneOverlap: orNull(info.timezone_overlap),
    contractType: orNull(info.contract_type),
    salaryRange: orNull(info.salary_range),
    matchResultJson: {
      ...result,
      job_description: sanitizeJobDescription(body.jobDescription),
      job_url: body.jobUrl || null,
    },
    matchedSkills: result.matched,
    gaps: result.gaps,
    mandatoryWarnings: result.mandatory_warnings,
    notes: body.notes?.trim() ? body.notes.trim() : null,
  });

  return NextResponse.json({ application }, { status: 201 });
});
