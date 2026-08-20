import { getNodeDb } from "./node";

/**
 * Runtime database entry point.
 *
 * Dierb Online now targets a standard server-side PostgreSQL connection for
 * production (including Vercel/Node). Keeping the application imports behind
 * this function prevents browser code from ever receiving DATABASE_URL and
 * avoids coupling runtime data access to Cloudflare/D1/Supabase bindings.
 */
export function getDb() {
  return getNodeDb();
}
