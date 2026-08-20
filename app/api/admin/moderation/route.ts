import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { advertisements,auditLogs,driverProfiles,questions,reports,serviceProfiles } from "../../../../db/pg-schema";
import { requireRole } from "../../../lib/authz";

type Body={entityType?:"service"|"question"|"report"|"ad"|"driver";entityId?:string;action?:string;reason?:string};
export async function PATCH(request:Request){
 try{
  const admin=await requireRole(["admin","super_admin","moderator"]),body=await request.json() as Body;
  if(!body.entityType||!body.entityId||!body.action)return Response.json({error:"بيانات المراجعة ناقصة"},{status:400});
  const entityType=body.entityType,entityId=body.entityId,action=body.action,reason=body.reason?.trim()||null;
  const db=getDb(),now=new Date();
  await db.transaction(async tx=>{
   if(entityType==="service"){
    const status=action==="approve"?"active":action==="reject"?"rejected":action==="suspend"?"suspended":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(serviceProfiles).set({status,verified:status==="active",updatedAt:now}).where(eq(serviceProfiles.id,entityId)).returning({id:serviceProfiles.id});if(!rows.length)throw new Error("not_found");
   }else if(entityType==="question"){
    if(action!=="hide"&&action!=="restore")throw new Error("invalid_action");
    const rows=await tx.update(questions).set({status:action==="hide"?"hidden":"open",updatedAt:now}).where(eq(questions.id,entityId)).returning({id:questions.id});if(!rows.length)throw new Error("not_found");
   }else if(entityType==="report"){
    const status=action==="resolve"?"resolved":action==="dismiss"?"dismissed":action==="review"?"reviewing":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(reports).set({status,resolvedBy:status==="resolved"||status==="dismissed"?admin.id:null,resolvedAt:status==="resolved"||status==="dismissed"?now:null,updatedAt:now}).where(eq(reports.id,entityId)).returning({id:reports.id});if(!rows.length)throw new Error("not_found");
   }else if(entityType==="ad"){
    const status=action==="approve"?"approved":action==="reject"?"rejected":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(advertisements).set({status,approvedBy:status==="approved"?admin.id:null,updatedAt:now}).where(eq(advertisements.id,entityId)).returning({id:advertisements.id});if(!rows.length)throw new Error("not_found");
   }else{
    const status=action==="approve"?"active":action==="reject"?"rejected":action==="suspend"?"suspended":null;if(!status)throw new Error("invalid_action");
    const rows=await tx.update(driverProfiles).set({status,updatedAt:now}).where(eq(driverProfiles.id,entityId)).returning({id:driverProfiles.id});if(!rows.length)throw new Error("not_found");
   }
   await tx.insert(auditLogs).values({id:crypto.randomUUID(),actorId:admin.id,action:`${entityType}.${action}`,entityType,entityId,metadataJson:JSON.stringify({reason})});
  });
  return Response.json({ok:true});
 }catch(e){if(e instanceof Response)return e;const message=e instanceof Error?e.message:"";return Response.json({error:message==="not_found"?"العنصر غير موجود":message==="invalid_action"?"الإجراء غير مسموح":"تعذر تنفيذ المراجعة"},{status:message==="not_found"?404:400});}
}
