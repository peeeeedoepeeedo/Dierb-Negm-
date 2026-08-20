import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "../../../db";
import { products, stores } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";

export async function POST(request:Request){
 try{const user=await requireApiUser();const body=await request.json() as Record<string,unknown>;const storeId=String(body.storeId??"");const db=getDb();
 const owned=await db.select({id:stores.id}).from(stores).where(and(eq(stores.id,storeId),eq(stores.ownerId,user.id),isNull(stores.deletedAt))).limit(1);
 if(!owned.length)return Response.json({error:"المتجر غير موجود أو لا تملكه"},{status:403});
 const name=String(body.name??"").trim(),price=Number(body.price),stock=Number(body.stock??0);if(name.length<2||!Number.isFinite(price)||price<0||!Number.isInteger(stock)||stock<0)return Response.json({error:"بيانات المنتج غير صحيحة"},{status:400});
 const id=crypto.randomUUID(),slug=`${name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-")}-${id.slice(0,6)}`;
 const [product]=await db.insert(products).values({id,storeId,name,slug,price,stock,unit:String(body.unit??"قطعة")}).returning();return Response.json({product},{status:201});
 }catch(error){if(error instanceof Response)return error;return Response.json({error:"تعذر إضافة المنتج"},{status:500})}
}
