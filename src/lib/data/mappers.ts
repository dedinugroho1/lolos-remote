import type { CvProfileRow, SavedApplicationRow } from "@/db/schema";
import type { Application, MatchSnapshot, StoredCvProfile } from "@/lib/schemas/application";
import type { CvProfile } from "@/lib/schemas/cv-profile";

export function toStoredCvProfile(row: CvProfileRow): StoredCvProfile {
  return {
    id: row.id,
    profileJson: row.profileJson as CvProfile,
    originalFileName: row.originalFileName,
    claudeModel: row.claudeModel,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toApplication(row: SavedApplicationRow): Application {
  return {
    id: row.id,
    jobTitle: row.jobTitle,
    companyName: row.companyName,
    fitScore: row.fitScore,
    locationRequirement: row.locationRequirement,
    timezoneOverlap: row.timezoneOverlap,
    contractType: row.contractType,
    salaryRange: row.salaryRange,
    matchResultJson: row.matchResultJson as MatchSnapshot,
    matchedSkills: row.matchedSkills,
    gaps: row.gaps,
    mandatoryWarnings: row.mandatoryWarnings,
    status: row.status,
    notes: row.notes,
    appliedAt: row.appliedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
