import { and, asc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, featureFlags, locations, systemSettings } from "@/db/pg-schema";
import { apiSuccess, withMobileApi } from "@/lib/mobile-api/http";
import { readStoresPage } from "@/lib/mobile-api/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return withMobileApi(request, async () => {
    const db = getDb();
    const [locationRows, categoryRows, settingRows, flagRows, storePage] = await Promise.all([
      db.select({ id: locations.id, parentId: locations.parentId, type: locations.type, nameAr: locations.nameAr, slug: locations.slug })
        .from(locations).where(and(eq(locations.active, true), isNull(locations.deletedAt))).orderBy(asc(locations.sortOrder), asc(locations.nameAr)),
      db.select({ id: categories.id, parentId: categories.parentId, entityType: categories.entityType, nameAr: categories.nameAr, slug: categories.slug, icon: categories.icon })
        .from(categories).where(and(eq(categories.active, true), isNull(categories.deletedAt))).orderBy(asc(categories.sortOrder), asc(categories.nameAr)),
      db.select({ key: systemSettings.key, value: systemSettings.value, valueType: systemSettings.valueType })
        .from(systemSettings).where(eq(systemSettings.public, true)),
      db.select({ key: featureFlags.key, enabled: featureFlags.enabled }).from(featureFlags),
      readStoresPage({ page: 1, limit: 20 }),
    ]);
    return apiSuccess(request, {
      apiVersion: "v1", currency: "EGP", locale: "ar-EG",
      locations: locationRows,
      categories: categoryRows,
      featuredStores: storePage.items.filter((store) => store.featured).slice(0, 8),
      settings: settingRows,
      featureFlags: flagRows,
    });
  });
}
