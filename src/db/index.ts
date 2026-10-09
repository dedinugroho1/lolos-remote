import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | null = null;

/**
 * Koneksi lazy via Neon Serverless Driver (HTTP). Dibuat saat pertama dipakai
 * agar `next build` tetap jalan tanpa DATABASE_URL.
 */
export function getDb(): Database {
  if (instance) return instance;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diatur. Salin .env.example ke .env.local lalu isi koneksi Neon.");
  instance = drizzle(neon(url), { schema });
  return instance;
}

export { schema };
