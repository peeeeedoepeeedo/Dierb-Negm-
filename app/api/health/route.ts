import { sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { getDatabaseUrlEnv } from "../../../db/node";

export const dynamic="force-dynamic";

export async function GET(){
 const checkedAt=new Date().toISOString();
 const resolved=getDatabaseUrlEnv();
 if(!resolved){
  return Response.json({status:"degraded",service:"dierb-online",database:"missing-env",databaseEnv:"none",checkedAt},{status:503,headers:{"cache-control":"no-store"}});
 }
 try{
  await getDb().execute(sql`select 1 as ok`);
  return Response.json({status:"ok",service:"dierb-online",database:"ok",databaseEnv:resolved.key,checkedAt},{headers:{"cache-control":"no-store"}});
 }catch{
  return Response.json({status:"degraded",service:"dierb-online",database:"connection-failed",databaseEnv:resolved.key,checkedAt},{status:503,headers:{"cache-control":"no-store"}});
 }
}
