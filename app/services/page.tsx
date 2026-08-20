/* eslint-disable @next/next/no-html-link-for-pages */
import { eq } from "drizzle-orm";
import { getDb } from "../../db";
import { serviceProfiles } from "../../db/pg-schema";
import { ServiceDirectory } from "./service-directory";
export const dynamic="force-dynamic";
export default async function ServicesPage(){const db=getDb(),rows=await db.select().from(serviceProfiles).where(eq(serviceProfiles.status,"active")).limit(100);return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الخدمات</small></span></a><a className="primary" href="/services/join">سجّل خدمتك</a></header><section><span className="kicker">صنايعية ومقدمو خدمات</span><h1>خدمات أهل ديرب</h1><p>لا تظهر هنا إلا الملفات التي اعتمدتها الإدارة.</p><ServiceDirectory rows={rows.map(r=>({...r,createdAt:r.createdAt.toISOString(),updatedAt:r.updatedAt.toISOString(),deletedAt:r.deletedAt?.toISOString()??null}))}/></section></main>}
