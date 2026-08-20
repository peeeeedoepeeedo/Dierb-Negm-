/* eslint-disable @next/next/no-html-link-for-pages */
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { advertisements,coupons,orders,products,stores,subscriptions,subscriptionPlans } from "../../db/pg-schema";
import { requireChatGPTUser } from "../chatgpt-auth";
import { requireApiUser } from "../lib/authz";
import { MerchantDashboard } from "./merchant-dashboard";
export const dynamic="force-dynamic";
export default async function Business(){
 const identity=await requireChatGPTUser("/business"),profile=await requireApiUser(),db=getDb();
 const merchantStores=await db.select().from(stores).where(eq(stores.ownerId,profile.id)),storeIds=merchantStores.map(s=>s.id);
 const [merchantProducts,merchantOrders,subs,merchantCoupons,merchantAds]=await Promise.all([
  storeIds.length?db.select().from(products).where(inArray(products.storeId,storeIds)).orderBy(desc(products.createdAt)):Promise.resolve([]),
  storeIds.length?db.select().from(orders).where(inArray(orders.storeId,storeIds)).orderBy(desc(orders.createdAt)).limit(100):Promise.resolve([]),
  storeIds.length?db.select({id:subscriptions.id,storeId:subscriptions.storeId,status:subscriptions.status,endsAt:subscriptions.endsAt,planName:subscriptionPlans.nameAr}).from(subscriptions).innerJoin(subscriptionPlans,eq(subscriptionPlans.id,subscriptions.planId)).where(inArray(subscriptions.storeId,storeIds)):Promise.resolve([]),
  storeIds.length?db.select().from(coupons).where(inArray(coupons.storeId,storeIds)).orderBy(desc(coupons.createdAt)).limit(50):Promise.resolve([]),
  db.select().from(advertisements).where(eq(advertisements.ownerId,profile.id)).orderBy(desc(advertisements.createdAt)).limit(50)
 ]);
 return <main className="dash-shell"><aside className="dash-side"><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>Business</small></span></a><nav><b>لوحة النشاط</b><a href="#products">المنتجات</a><a href="#orders">الطلبات</a><a href="#coupons">الكوبونات</a><a href="#ads">الإعلانات</a><a href="#subscription">الاشتراك</a></nav><a href="/api/auth/logout?returnTo=/">تسجيل الخروج</a></aside><section className="dash-main"><header><div><small>مرحبًا، {identity.displayName}</small><h1>إدارة نشاطك على ديرب</h1></div><span className="status-pill">حساب موثّق</span></header><MerchantDashboard initialStores={merchantStores.map(s=>({...s,createdAt:s.createdAt.toISOString(),updatedAt:s.updatedAt.toISOString(),deletedAt:s.deletedAt?.toISOString()??null}))} initialProducts={merchantProducts.map(p=>({...p,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString(),deletedAt:p.deletedAt?.toISOString()??null}))} initialOrders={merchantOrders.map(o=>({...o,createdAt:o.createdAt.toISOString(),updatedAt:o.updatedAt.toISOString(),deletedAt:o.deletedAt?.toISOString()??null}))} subscriptions={subs.map(s=>({...s,endsAt:s.endsAt.toISOString()}))} coupons={merchantCoupons.map(c=>({...c,startsAt:c.startsAt.toISOString(),endsAt:c.endsAt.toISOString(),createdAt:c.createdAt.toISOString(),updatedAt:c.updatedAt.toISOString(),deletedAt:c.deletedAt?.toISOString()??null}))} ads={merchantAds.map(a=>({...a,startsAt:a.startsAt.toISOString(),endsAt:a.endsAt.toISOString(),createdAt:a.createdAt.toISOString(),updatedAt:a.updatedAt.toISOString(),deletedAt:a.deletedAt?.toISOString()??null}))}/></section></main>;
}
