import { readStoresPage } from "@/lib/mobile-api/catalog";
import { apiSuccess, withMobileApi } from "@/lib/mobile-api/http";
import { optionalText, positiveInteger } from "@/lib/mobile-api/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return withMobileApi(request, async () => {
    const params = new URL(request.url).searchParams;
    const result = await readStoresPage({
      page: positiveInteger(params, "page", 1, 10_000), limit: positiveInteger(params, "limit", 20, 50),
      query: optionalText(params, "q", 100), categoryId: optionalText(params, "categoryId", 128),
      locationId: optionalText(params, "locationId", 128),
    });
    return apiSuccess(request, result);
  });
}
