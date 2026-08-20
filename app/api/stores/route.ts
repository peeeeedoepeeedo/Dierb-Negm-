import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditLogs, stores, userRoles } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";

function slugify(value:string){return value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/(^-|-$)/g,"")}
export async function GET(){
  const user=await requireApiUser(); const db=getDb();
  return Response.json({stores:await db.select().from(stores).where(and(eq(stores.ownerId,user.id),isNull(stores.deletedAt)))});
}
export async function POST(request:Request){
  try{
    const user=await requireApiUser(); const body=await request.json() as Record<string,unknown>;
    const name=String(body.name??"").trim(),phone=String(body.phone??"").trim(),address=String(body.address??"").trim();
    if(name.length<3||phone.length<8||address.length<5) return Response.json({error:"الاسم والهاتف والعنوان مطلوبة وبصيغة صحيحة"},{status:400});
    const db=getDb(),id=crypto.randomUUID(),slug=`${slugify(name)}-${id.slice(0,6)}`;
    const [store]=await db.insert(stores).values({id,ownerId:user.id,name,slug,phone,address,whatsapp:String(body.whatsapp??"").trim()||null,description:String(body.description??"").trim()||null,status:"pending"}).returning();
    await db.insert(userRoles).values({id:crypto.randomUUID(),userId:user.id,role:"merchant"}).onConflictDoNothing();
    await db.insert(auditLogs).values({id:crypto.randomUUID(),actorId:user.id,action:"store.created",entityType:"store",entityId:id});
    return Response.json({store},{status:201});
  }catch(error){if(error instanceof Response)return error;return Response.json({error:"تعذر إنشاء المتجر"},{status:500})}
}
