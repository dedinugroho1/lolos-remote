/**
 * Seed data demo: 1 profil CV + 5 lamaran contoh (PRD Bab 9) untuk satu sesi.
 *
 *   npm run db:seed                 → buat sesi demo baru (UUID acak)
 *   npm run db:seed -- <session-id> → isi data ke sesi browser Anda sendiri
 *
 * Nilai cookie `lolosremote_session` bisa dilihat di DevTools → Application → Cookies.
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { buildDummyApplications } from "../lib/dummy/applications";
import { dummyCvProfile } from "../lib/dummy/cv-profile";
import { cvProfileSchema } from "../lib/schemas/cv-profile";
import { cvProfiles, savedApplications } from "./schema";

config({ path: ".env.local" });
config();

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diatur di .env.local");

  const arg = process.argv[2] ?? process.env.SEED_SESSION_ID;
  if (arg && !UUID_V4.test(arg)) throw new Error(`Session ID "${arg}" bukan UUID v4 yang valid.`);
  const sessionId = arg ?? crypto.randomUUID();

  const db = drizzle(neon(url));
  const profile = cvProfileSchema.parse(dummyCvProfile);
  const apps = buildDummyApplications();

  await db.batch([
    db.delete(savedApplications).where(eq(savedApplications.userSessionId, sessionId)),
    db
      .insert(cvProfiles)
      .values({
        userSessionId: sessionId,
        profileJson: profile,
        originalFileName: "CV_Contoh_Frontend_Engineer.pdf",
        claudeModel: process.env.CLAUDE_MODEL ?? "claude-haiku-5-5",
      })
      .onConflictDoUpdate({
        target: cvProfiles.userSessionId,
        set: { profileJson: profile, originalFileName: "CV_Contoh_Frontend_Engineer.pdf", updatedAt: new Date() },
      }),
    db.insert(savedApplications).values(
      apps.map((a) => ({
        // ID baru agar seed bisa dijalankan untuk banyak sesi tanpa bentrok primary key.
        userSessionId: sessionId,
        jobTitle: a.jobTitle,
        companyName: a.companyName,
        fitScore: a.fitScore,
        locationRequirement: a.locationRequirement,
        timezoneOverlap: a.timezoneOverlap,
        contractType: a.contractType,
        salaryRange: a.salaryRange,
        matchResultJson: a.matchResultJson,
        matchedSkills: a.matchedSkills,
        gaps: a.gaps,
        mandatoryWarnings: a.mandatoryWarnings,
        status: a.status,
        notes: a.notes,
        appliedAt: new Date(a.appliedAt),
        updatedAt: new Date(a.updatedAt),
      })),
    ),
  ]);

  console.log("\n✅ Seed selesai");
  console.log(`   Sesi        : ${sessionId}`);
  console.log(`   Profil CV   : 1`);
  console.log(`   Lamaran     : ${apps.length}`);
  if (!arg) {
    console.log("\nUntuk melihat data ini di browser, set cookie `lolosremote_session` ke nilai sesi di atas");
    console.log("(DevTools → Application → Cookies → http://localhost:3000), lalu muat ulang /history.\n");
  }
}

main().catch((error) => {
  console.error("❌ Seed gagal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
