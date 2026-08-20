/* eslint-disable @next/next/no-html-link-for-pages */
import { desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../db";
import { advertisements,auditLogs,driverProfiles,listings,orders,profiles,questions,reports,serviceProfiles,stores,subscriptions,supportTickets } from "../../db/pg-schema";
import { requireRole } from "../lib/authz";
import { StoreReviewList } from "./store-review-list";
import { ListingReviewList } from "./listing-review-list";
import { ModerationCenter } from "./moderation-center";
export const dynamic="force-dynamic";
const n=(rows:Array<{count:number|string}>)=>Number(rows[0]?.count??0);
export default async function AdminPage(){
 const admin=await requireRole(["admin","super_admin"]),db=getDb();
 const [pending,pendingListings,pendingServices,openReports,recentQuestions,pendingAds,pendingDrivers,recentAudit,userCount,orderCount,storeCount,serviceCount,listingCount,subscriptionCount,ticketCount]=await Promise.all([
  db.select({id:stores.id,name:stores.name,phone:stores.phone,address:stores.address,status:stores.status,createdAt:stores.createdAt}).from(stores).where(eq(stores.status,"pending")).limit(50),
  db.select({id:listings.id,title:listings.title,kind:listings.kind,phone:listings.phone,createdAt:listings.createdAt}).from(listings).where(eq(listings.status,"pending")).limit(50),
  db.select({id:serviceProfiles.id,name:serviceProfiles.name,profession:serviceProfiles.profession,phone:serviceProfiles.phone,status:serviceProfiles.status}).from(serviceProfiles).where(eq(serviceProfiles.status,"pending")).limit(50),
  db.select({id:reports.id,entityType:reports.entityType,entityId:reports.entityId,reason:reports.reason,status:reports.status}).from(reports).where(eq(reports.status,"open")).orderBy(desc(reports.createdAt)).limit(50),
  db.select({id:questions.id,title:questions.title,status:questions.status}).from(questions).orderBy(desc(questions.createdAt)).limit(20),
  db.select({id:advertisements.id,title:advertisements.title,placement:advertisements.placement,status:advertisements.status}).from(advertisements).where(eq(advertisements.status,"pending")).limit(50),
  db.select({id:driverProfiles.id,phone:driverProfiles.phone,vehicleType:driverProfiles.vehicleType,status:driverProfiles.status}).from(driverProfiles).where(eq(driverProfiles.status,"pending")).limit(50),
  db.select({id:auditLogs.id,action:auditLogs.action,entityType:auditLogs.entityType,entityId:auditLogs.entityId,createdAt:auditLogs.createdAt}).from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(20),
  db.select({count:sql<number>`count(*)`}).from(profiles),db.select({count:sql<number>`count(*)`}).from(orders),db.select({count:sql<number>`count(*)`}).from(stores),db.select({count:sql<number>`count(*)`}).from(serviceProfiles),db.select({count:sql<number>`count(*)`}).from(listings),db.select({count:sql<number>`count(*)`}).from(subscriptions),db.select({count:sql<number>`count(*)`}).from(supportTickets)
 ]);
 return <main className="admin-page"><header><div><span className="kicker">Dierb Admin</span><h1>مركز تشغيل ديرب أونلاين</h1><p>مسجل الدخول: {admin.fullName??admin.email}</p></div><a className="ghost" href="/">العودة للرئيسية</a></header>
 <nav className="admin-nav"><a href="#overview">نظرة عامة</a><a href="#stores">المتاجر</a><a href="#listings">الإعلانات</a><a href="#moderation">المراجعة</a><a href="#audit">سجل التدقيق</a></nav>
 <section className="admin-summary" id="overview"><article><b>{n(userCount)}</b><span>مستخدم</span></article><article><b>{n(storeCount)}</b><span>متجر</span></article><article><b>{n(orderCount)}</b><span>طلب</span></article><article><b>{n(serviceCount)}</b><span>مقدم خدمة</span></article><article><b>{n(listingCount)}</b><span>إعلان</span></article><article><b>{n(subscriptionCount)}</b><span>اشتراك</span></article><article><b>{n(ticketCount)}</b><span>تذكرة دعم</span></article><article><b>{openReports.length}</b><span>بلاغ مفتوح</span></article></section>
 <section id="stores"><StoreReviewList initialStores={pending.map(s=>({...s,createdAt:s.createdAt.toISOString()}))}/></section>
 <section id="listings"><ListingReviewList initialListings={pendingListings.map(s=>({...s,createdAt:s.createdAt.toISOString()}))}/></section>
 <section id="moderation"><ModerationCenter services={pendingServices} reports={openReports} questions={recentQuestions} ads={pendingAds} drivers={pendingDrivers}/></section>
 <section className="review-card" id="audit"><div className="review-head"><div><span className="kicker">الأمان والمساءلة</span><h2>آخر تغييرات الإدارة</h2></div><b>{recentAudit.length}</b></div><div className="review-list">{recentAudit.length===0?<p>لا توجد تغييرات مسجلة بعد.</p>:recentAudit.map(x=><article key={x.id}><div><b>{x.action}</b><small>{x.entityType}{x.entityId?` · ${x.entityId}`:""}</small></div><time>{x.createdAt.toLocaleString("ar-EG")}</time></article>)}</div></section>
 </main>;
}
