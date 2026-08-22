import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { getDatabaseUrlEnv } from "@/db/node";
import { apiSuccess, MobileApiError, withMobileApi } from "@/lib/mobile-api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return withMobileApi(request, async () => {
    if (!getDatabaseUrlEnv()) throw new MobileApiError(503, "DATABASE_UNAVAILABLE", "خدمة البيانات غير متاحة حاليًا.");
    try { await getDb().execute(sql`select 1 as ok`); }
    catch { throw new MobileApiError(503, "DATABASE_UNAVAILABLE", "خدمة البيانات غير متاحة حاليًا."); }
    return apiSuccess(request, { service: "dierb-online-mobile-api", version: "v1", status: "ok" });
  });
}
