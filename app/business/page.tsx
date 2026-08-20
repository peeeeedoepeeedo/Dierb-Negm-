/* eslint-disable @next/next/no-html-link-for-pages */
import { desc,eq,inArray } from "drizzle-orm";
import { getDb } from "../../db";
import { advertisements,coupons,orders,products,profiles,serviceProfiles,serviceRequests,stores,subscriptions,subscriptionPlans } from "../../db/pg-schema";
import { requireChatGPTUser } from "../chatgpt-auth";
import { requireApiUser } from "../lib/authz";
import { MerchantDashboard } from "./merchant-dashboard";
import { ServiceProviderPanel } from "./service-provider-panel";
import { StoreSetup } from "./store-setup";
export const dynamic="force-dynamic";
export default async function Business(){
 const identity=await requireChatGPTUser("/business"),profile=await requireApiUser(),db=getDb();
 const [merchantStores,providerProfiles]=await Promise.all([db.select().from(stores).where(eq(stores.ownerId,profile.id)),db.select().from(serviceProfiles).where(eq(serviceProfiles.ownerId,profile.id))]);
 const storeIds=merchantStores.map(s=>s.id),providerIds=providerProfiles.map(s=>s.id);
 const [merchantProducts,merchantOrders,subs,merchantCoupons,merchantAds,providerRequests]=await Promise.all([
  storeIds.length?db.select().from(products).where(inArray(products.storeId,storeIds)).orderBy(desc(products.createdAt)):Promise.resolve([]),
  storeIds.length?db.select().from(orders).where(inArray(orders.storeId,storeIds)).orderBy(desc(orders.createdAt)).limit(100):Promise.resolve([]),
  storeIds.length?db.select({id:subscriptions.id,storeId:subscriptions.storeId,status:subscriptions.status,endsAt:subscriptions.endsAt,planName:subscriptionPlans.nameAr}).from(subscriptions).innerJoin(subscriptionPlans,eq(subscriptionPlans.id,subscriptions.planId)).where(inArray(subscriptions.storeId,storeIds)):Promise.resolve([]),
  storeIds.length?db.select().from(coupons).where(inArray(coupons.storeId,storeIds)).orderBy(desc(coupons.createdAt)).limit(50):Promise.resolve([]),
  db.select().from(advertisements).where(eq(advertisements.ownerId,profile.id)).orderBy(desc(advertisements.createdAt)).limit(50),
  providerIds.length?db.select({id:serviceRequests.id,providerId:serviceRequests.providerId,customerName:profiles.fullName,details:serviceRequests.details,preferredAt:serviceRequests.preferredAt,status:serviceRequests.status,createdAt:serviceRequests.createdAt}).from(serviceRequests).innerJoin(profiles,eq(profiles.id,serviceRequests.customerId)).where(inArray(serviceRequests.providerId,providerIds)).orderBy(desc(serviceRequests.createdAt)).limit(100):Promise.resolve([])
 ]);
 const hasStore=merchantStores.length>0,hasService=providerProfiles.length>0;
 return <main className="dash-shell"><aside className="dash-side"><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>Business</small></span></a><nav><b>لوحة النشاط</b>{hasStore&&<><a href="#products">المنتجات</a><a href="#orders">طلبات المتجر</a><a href="#coupons">الكوبونات</a><a href="#ads">الإعلانات</a><a href="#subscription">الاشتراك</a></>}{hasService&&<><a href="#service-business">خدماتي</a><a href="#service-requests">طلبات الخدمات</a></>}<a href="#add-activity">إضافة نشاط</a></nav><a href="/api/auth/logout?returnTo=/">تسجيل الخروج</a></aside><section className="dash-main"><header><div><small>مرحبًا، {identity.displayName}</small><h1>ديرب بيزنس</h1><p>أدر متجرك وخدماتك من حساب واحد.</p></div><span className="status-pill">حساب نشط</span></header>
 {hasStore&&<MerchantDashboard initialStores={merchantStores.map(s=>({...s,createdAt:s.createdAt.toISOString(),updatedAt:s.updatedAt.toISOString(),deletedAt:s.deletedAt?.toISOString()??null}))} initialProducts={merchantProducts.map(p=>({...p,createdAt:p.createdAt.toISOString(),updatedAt:p.updatedAt.toISOString(),deletedAt:p.deletedAt?.toISOString()??null}))} initialOrders={merchantOrders.map(o=>({...o,createdAt:o.createdAt.toISOString(),updatedAt:o.updatedAt.toISOString(),deletedAt:o.deletedAt?.toISOString()??null}))} subscriptions={subs.map(s=>({...s,endsAt:s.endsAt.toISOString()}))} coupons={merchantCoupons.map(c=>({...c,startsAt:c.startsAt.toISOString(),endsAt:c.endsAt.toISOString(),createdAt:c.createdAt.toISOString(),updatedAt:c.updatedAt.toISOString(),deletedAt:c.deletedAt?.toISOString()??null}))} ads={merchantAds.map(a=>({...a,startsAt:a.startsAt.toISOString(),endsAt:a.endsAt.toISOString(),createdAt:a.createdAt.toISOString(),updatedAt:a.updatedAt.toISOString(),deletedAt:a.deletedAt?.toISOString()??null}))}/>}
 {hasService&&<ServiceProviderPanel providers={providerProfiles.map(p=>({id:p.id,name:p.name,profession:p.profession,status:p.status,verified:p.verified}))} initialRequests={providerRequests.map(r=>({...r,preferredAt:r.preferredAt?.toISOString()??null,createdAt:r.createdAt.toISOString()}))}/>} 
 {!hasStore&&!hasService&&<section className="business-onboarding"><div className="form-card"><span className="kicker">ابدأ نشاطك</span><h2>اختار طريقة ظهورك على ديرب</h2><p>لو عندك محل أو نشاط تجاري سجله كمتجر. ولو بتقدم مهنة أو خدمة سجّل ملف خدمة.</p><a className="primary" href="/services/join">أنا مقدم خدمة</a></div></section>}
 <section id="add-activity"><details className="form-card" open={!hasStore&&!hasService}><summary><b>{hasStore?"إضافة متجر آخر":"تسجيل متجر أو نشاط تجاري"}</b></summary><StoreSetup/></details>{!hasService&&<div className="form-card"><span className="kicker">مقدم خدمة؟</span><h2>سجّل خدمتك في دليل ديرب</h2><p>اختار المهنة والقرية، وبعد الاعتماد تستقبل طلبات العملاء هنا.</p><a className="primary" href="/services/join">تسجيل خدمة</a></div>}</section>
 </section></main>;
}
