import { and, asc, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, locations, products, stores } from "@/db/pg-schema";

export type CatalogPage = { page: number; limit: number; query?: string; categoryId?: string; locationId?: string };

export async function readStoresPage(input: CatalogPage) {
  const filters = [eq(stores.status, "active"), isNull(stores.deletedAt)];
  if (input.categoryId) filters.push(eq(stores.categoryId, input.categoryId));
  if (input.locationId) filters.push(eq(stores.locationId, input.locationId));
  if (input.query) filters.push(or(ilike(stores.name, `%${input.query}%`), ilike(stores.description, `%${input.query}%`))!);
  const rows = await getDb().select({
    id: stores.id, name: stores.name, slug: stores.slug, description: stores.description,
    categoryId: stores.categoryId, categoryName: categories.nameAr,
    locationId: stores.locationId, locationName: locations.nameAr, address: stores.address,
    logoKey: stores.logoKey, coverKey: stores.coverKey, deliveryEnabled: stores.deliveryEnabled,
    minimumOrder: stores.minimumOrder, deliveryFee: stores.deliveryFee,
    verified: stores.verified, featured: stores.featured,
  }).from(stores)
    .leftJoin(categories, eq(categories.id, stores.categoryId))
    .leftJoin(locations, eq(locations.id, stores.locationId))
    .where(and(...filters))
    .orderBy(desc(stores.featured), desc(stores.verified), asc(stores.name))
    .limit(input.limit + 1).offset((input.page - 1) * input.limit);
  return { items: rows.slice(0, input.limit), page: input.page, limit: input.limit, hasNextPage: rows.length > input.limit };
}

export async function readProductsPage(input: CatalogPage & { storeId?: string }) {
  const filters = [eq(products.active, true), isNull(products.deletedAt), eq(stores.status, "active"), isNull(stores.deletedAt)];
  if (input.storeId) filters.push(eq(products.storeId, input.storeId));
  if (input.categoryId) filters.push(eq(products.categoryId, input.categoryId));
  if (input.locationId) filters.push(eq(stores.locationId, input.locationId));
  if (input.query) filters.push(or(ilike(products.name, `%${input.query}%`), ilike(products.description, `%${input.query}%`))!);
  const rows = await getDb().select({
    id: products.id, storeId: products.storeId, storeName: stores.name,
    categoryId: products.categoryId, name: products.name, slug: products.slug,
    description: products.description, price: products.price, compareAtPrice: products.compareAtPrice,
    stock: products.stock, unit: products.unit, featured: products.featured, sponsored: products.sponsored,
  }).from(products).innerJoin(stores, eq(stores.id, products.storeId))
    .where(and(...filters))
    .orderBy(desc(products.sponsored), desc(products.featured), asc(products.name))
    .limit(input.limit + 1).offset((input.page - 1) * input.limit);
  return { items: rows.slice(0, input.limit), page: input.page, limit: input.limit, hasNextPage: rows.length > input.limit };
}
