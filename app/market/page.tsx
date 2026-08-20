/* eslint-disable @next/next/no-html-link-for-pages */
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../db";
import { products, stores } from "../../db/pg-schema";
import { MarketGrid } from "./market-grid";
export const dynamic="force-dynamic";
export default async function MarketPage(){const db=getDb();const rows=await db.select({id:products.id,name:products.name,price:products.price,stock:products.stock,unit:products.unit,storeId:stores.id,storeName:stores.name,storeSlug:stores.slug}).from(products).innerJoin(stores,eq(stores.id,products.storeId)).where(and(eq(products.active,true),eq(stores.status,"active"),isNull(products.deletedAt),isNull(stores.deletedAt))).limit(100);return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>السوق المحلي</small></span></a><a className="primary" href="/cart">السلة</a></header><section><span className="kicker">منتجات من بلدك</span><h1>سوق ديرب</h1><p>كل المنتجات المعروضة مرتبطة بمتاجر معتمدة ومخزون حقيقي.</p><MarketGrid products={rows}/></section></main>}
