import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { auditLogs, orders, orderStatusHistory, stores } from "../../../../db/pg-schema";
import { requireApiUser } from "../../../lib/authz";
const allowed:Record<string,string[]>={pending:["confirmed","rejected"],confirmed:["preparing","cancelled"],preparing:["ready"],ready:["out_for_delivery","delivered"],out_for_delivery:["delivered"],delivered:["refunded"]};

export async function PATCH(request:Request){
  try{
    const user=await requireApiUser(),body=await request.json() as {orderId?:string;status?:string;note?:string};
    if(!body.orderId||!body.status)return Response.json({error:"بيانات الحالة ناقصة"},{status:400});
    const db=getDb();
    const [order]=await db.select({id:orders.id,status:orders.status,storeId:orders.storeId}).from(orders).innerJoin(stores,eq(stores.id,orders.storeId)).where(and(eq(orders.id,body.orderId),eq(stores.ownerId,user.id))).limit(1);
    if(!order)return Response.json({error:"الطلب غير موجود أو لا يخص متجرك"},{status:403});
    if(!(allowed[order.status]??[]).includes(body.status))return Response.json({error:"الانتقال بين حالتي الطلب غير مسموح"},{status:409});
    await db.transaction(async(tx)=>{
      await tx.update(orders).set({status:body.status as typeof orders.$inferInsert.status,updatedAt:new Date()}).where(eq(orders.id,order.id));
      await tx.insert(orderStatusHistory).values({id:crypto.randomUUID(),orderId:order.id,fromStatus:order.status,toStatus:body.status!,changedBy:user.id,note:body.note?.trim()||null});
      await tx.insert(auditLogs).values({id:crypto.randomUUID(),actorId:user.id,action:"order.status_changed",entityType:"order",entityId:order.id,metadataJson:JSON.stringify({from:order.status,to:body.status})});
    });
    return Response.json({ok:true,status:body.status});
  }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر تحديث حالة الطلب"},{status:500})}
}
