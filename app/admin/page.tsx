/* eslint-disable @next/next/no-html-link-for-pages */
import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { listings, stores } from "../../db/pg-schema";
import { requireRole } from "../lib/authz";
import { StoreReviewList } from "./store-review-list";
import { ListingReviewList } from "./listing-review-list";
export const dynamic="force-dynamic";
export default async function AdminPage(){const admin=await requireRole(["admin","super_admin"]),db=getDb();const pending=await db.select({id:stores.id,name:stores.name,phone:stores.phone,address:stores.address,status:stores.status,createdAt:stores.createdAt}).from(stores).where(eq(stores.status,"pending")),pendingListings=await db.select({id:listings.id,title:listings.title,kind:listings.kind,phone:listings.phone,createdAt:listings.createdAt}).from(listings).where(eq(listings.status,"pending"));return <main className="admin-page"><header><div><span className="kicker">Derb Admin</span><h1>مركز المراجعة</h1><p>مسجل الدخول: {admin.fullName??admin.email}</p></div><a className="ghost" href="/">العودة للرئيسية</a></header><section className="admin-summary"><article><b>{pending.length}</b><span>متجر ينتظر المراجعة</span></article><article><b>{pendingListings.length}</b><span>إعلان ينتظر المراجعة</span></article><article><b>مفعّل</b><span>سجل المراجعات والتغييرات</span></article></section><StoreReviewList initialStores={pending.map(s=>({...s,createdAt:s.createdAt.toISOString()}))}/><ListingReviewList initialListings={pendingListings.map(s=>({...s,createdAt:s.createdAt.toISOString()}))}/></main>}
