import "server-only";
import { cache } from "react";
import { getCvProfile } from "@/lib/data/queries";
import { readSessionId } from "@/lib/session";

/** CV milik sesi saat ini — di-dedupe per request (layout + page memakai hasil yang sama). */
export const getCurrentCv = cache(async () => {
  const sessionId = await readSessionId();
  return sessionId ? getCvProfile(sessionId) : null;
});
