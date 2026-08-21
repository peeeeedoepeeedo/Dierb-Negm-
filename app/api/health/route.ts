import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export const dynamic="force-dynamic";

export async function GET(){
 const checkedAt=new Date().toISOString();
 if(!process.env.DATABASE_URL){
  return Response.json({status:"degraded",service:"dierb-online",database:"missing-env",checkedAt},{status:503,headers:{"cache-control":"no-store"}});
 }
 try{
  await getDb().execute(sql`select 1 as ok`);
  return Response.json({status:"ok",service:"dierb-online",database:"ok",checkedAt},{headers:{"cache-control":"no-store"}});
 }catch{
  return Response.json({status:"degraded",service:"dierb-online",database:"connection-failed",checkedAt},{status:503,headers:{"cache-control":"no-store"}});
 }
}
