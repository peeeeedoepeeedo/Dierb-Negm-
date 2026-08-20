import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../../db";
import { auditLogs,categories,locations,stores,userRoles } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";
function slugify(value:string){return value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/(^-|-$)/g,"")}
export async function GET(){const user=await requireApiUser();const db=getDb();return Response.json({stores:await db.select().from(stores).where(and(eq(stores.ownerId,user.id),isNull(stores.deletedAt)))})}
export async function POST(request:Request){
 try{
  const user=await requireApiUser(),body=await request.json() as Record<string,unknown>,name=String(body.name??"").trim(),phone=String(body.phone??"").trim(),address=String(body.address??"").trim(),locationId=String(body.locationId??""),categoryId=String(body.categoryId??"");
  if(name.length<3||phone.length<8||address.length<5||!locationId||!categoryId)return Response.json({error:"الاسم والهاتف والعنوان والقرية والتصنيف مطلوبة"},{status:400});
  const db=getDb(),[location,category]=await Promise.all([db.select({id:locations.id}).from(locations).where(and(eq(locations.id,locationId),eq(locations.active,true),isNull(locations.deletedAt))).limit(1),db.select({id:categories.id}).from(categories).where(and(eq(categories.id,categoryId),eq(categories.entityType,"store"),eq(categories.active,true),isNull(categories.deletedAt))).limit(1)]);
  if(!location.length||!category.length)return Response.json({error:"القرية أو تصنيف النشاط غير صالح"},{status:400});
  const id=crypto.randomUUID(),slug=`${slugify(name)}-${id.slice(0,6)}`;
  const [store]=await db.insert(stores).values({id,ownerId:user.id,categoryId,locationId,name,slug,phone,address,whatsapp:String(body.whatsapp??"").trim()||null,description:String(body.description??"").trim()||null,status:"pending"}).returning();
  await db.insert(userRoles).values({id:crypto.randomUUID(),userId:user.id,role:"merchant"}).onConflictDoNothing();
  await db.insert(auditLogs).values({id:crypto.randomUUID(),actorId:user.id,action:"store.created",entityType:"store",entityId:id,metadataJson:JSON.stringify({locationId,categoryId})});
  return Response.json({store},{status:201});
 }catch(error){if(error instanceof Response)return error;return Response.json({error:"تعذر إنشاء المتجر"},{status:500})}
}
