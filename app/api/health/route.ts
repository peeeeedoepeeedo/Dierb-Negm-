import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export const dynamic="force-dynamic";

export async function GET(){
 const checkedAt=new Date().toISOString();
 try{
  await getDb().execute(sql`select 1 as ok`);
  return Response.json({status:"ok",service:"dierb-online",database:"ok",checkedAt},{headers:{"cache-control":"no-store"}});
 }catch{
  return Response.json({status:"degraded",service:"dierb-online",database:"unavailable",checkedAt},{status:503,headers:{"cache-control":"no-store"}});
 }
}
