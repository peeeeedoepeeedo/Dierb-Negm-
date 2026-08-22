import { readProductsPage, readStoresPage } from "@/lib/mobile-api/catalog";
import { apiSuccess, withMobileApi } from "@/lib/mobile-api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return withMobileApi(request, async () => {
    const [stores, products] = await Promise.all([
      readStoresPage({ page: 1, limit: 50 }),
      readProductsPage({ page: 1, limit: 50 }),
    ]);
    return apiSuccess(request, { stores: stores.items, products: products.items });
  });
}
