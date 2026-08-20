import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { auditLogs, notifications, stores } from "../../../../db/pg-schema";
import { requireRole } from "../../../lib/authz";

export async function PATCH(request:Request){
  try{
    const admin=await requireRole(["admin","super_admin"]);
    const body=await request.json() as {storeId?:string;action?:"approve"|"reject"|"suspend";reason?:string};
    if(!body.storeId||!body.action)return Response.json({error:"بيانات الإجراء ناقصة"},{status:400});
    const map={approve:"active",reject:"rejected",suspend:"suspended"} as const;
    const db=getDb();
    const store=await db.transaction(async(tx)=>{
      const [updated]=await tx.update(stores).set({status:map[body.action!],updatedAt:new Date()}).where(eq(stores.id,body.storeId!)).returning();
      if(!updated)return null;
      await tx.insert(auditLogs).values({id:crypto.randomUUID(),actorId:admin.id,action:`store.${body.action}`,entityType:"store",entityId:updated.id,metadataJson:JSON.stringify({reason:body.reason??null})});
      await tx.insert(notifications).values({id:crypto.randomUUID(),userId:updated.ownerId,type:"store_status",title:body.action==="approve"?"تم اعتماد متجرك":"تم تحديث حالة متجرك",body:body.reason?.trim()||`حالة المتجر الآن: ${map[body.action!]}`,entityType:"store",entityId:updated.id});
      return updated;
    });
    if(!store)return Response.json({error:"المتجر غير موجود"},{status:404});
    return Response.json({store});
  }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر تنفيذ الإجراء الإداري"},{status:500})}
}
