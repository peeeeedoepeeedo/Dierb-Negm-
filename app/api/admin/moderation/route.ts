import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { advertisements,auditLogs,driverProfiles,questions,reports,serviceProfiles } from "../../../../db/pg-schema";
import { requireRole } from "../../../lib/authz";

type Body={entityType?:"service"|"question"|"report"|"ad"|"driver";entityId?:string;action?:string;reason?:string};
export async function PATCH(request:Request){
 try{
  const admin=await requireRole(["admin","super_admin","moderator"]),body=await request.json() as Body;if(!body.entityType||!body.entityId||!body.action)return Response.json({error:"بيانات المراجعة ناقصة"},{status:400});
  const db=getDb(),now=new Date();
  await db.transaction(async tx=>{
   if(body.entityType==="service"){
    const status=body.action==="approve"?"active":body.action==="reject"?"rejected":body.action==="suspend"?"suspended":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(serviceProfiles).set({status,verified:status==="active",updatedAt:now}).where(eq(serviceProfiles.id,body.entityId!)).returning({id:serviceProfiles.id});if(!rows.length)throw new Error("not_found");
   }else if(body.entityType==="question"){
    if(body.action!=="hide"&&body.action!=="restore")throw new Error("invalid_action");
    const rows=await tx.update(questions).set({status:body.action==="hide"?"hidden":"open",updatedAt:now}).where(eq(questions.id,body.entityId!)).returning({id:questions.id});if(!rows.length)throw new Error("not_found");
   }else if(body.entityType==="report"){
    const status=body.action==="resolve"?"resolved":body.action==="dismiss"?"dismissed":body.action==="review"?"reviewing":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(reports).set({status,resolvedBy:status==="resolved"||status==="dismissed"?admin.id:null,resolvedAt:status==="resolved"||status==="dismissed"?now:null,updatedAt:now}).where(eq(reports.id,body.entityId!)).returning({id:reports.id});if(!rows.length)throw new Error("not_found");
   }else if(body.entityType==="ad"){
    const status=body.action==="approve"?"approved":body.action==="reject"?"rejected":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(advertisements).set({status,approvedBy:status==="approved"?admin.id:null,updatedAt:now}).where(eq(advertisements.id,body.entityId!)).returning({id:advertisements.id});if(!rows.length)throw new Error("not_found");
   }else{
    const status=body.action==="approve"?"active":body.action==="reject"?"rejected":body.action==="suspend"?"suspended":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(driverProfiles).set({status,updatedAt:now}).where(eq(driverProfiles.id,body.entityId!)).returning({id:driverProfiles.id});if(!rows.length)throw new Error("not_found");
   }
   await tx.insert(auditLogs).values({id:crypto.randomUUID(),actorId:admin.id,action:`${body.entityType}.${body.action}`,entityType:body.entityType,entityId:body.entityId,metadataJson:JSON.stringify({reason:body.reason?.trim()||null})});
  });
  return Response.json({ok:true});
 }catch(e){if(e instanceof Response)return e;const message=e instanceof Error?e.message:"";return Response.json({error:message==="not_found"?"العنصر غير موجود":message==="invalid_action"?"الإجراء غير مسموح":"تعذر تنفيذ المراجعة"},{status:message==="not_found"?404:400});}
}
