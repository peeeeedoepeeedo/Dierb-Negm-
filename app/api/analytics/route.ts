import { getDb } from "../../../db";
import { analyticsEvents } from "../../../db/pg-schema";
import { getChatGPTUser } from "../../chatgpt-auth";
import { profiles } from "../../../db/pg-schema";
import { eq } from "drizzle-orm";
const allowed=new Set(["store_view","product_view","service_view","search","result_click","favorite","phone_click","whatsapp_click","add_to_cart","checkout_started","order_created","ad_impression","ad_click"]);
export async function POST(request:Request){try{const body=await request.json() as {event?:string;entityType?:string;entityId?:string;sessionKey?:string;metadata?:unknown};if(!body.event||!allowed.has(body.event))return Response.json({error:"حدث غير صالح"},{status:400});const db=getDb(),identity=await getChatGPTUser();let userId:string|undefined;if(identity){const [profile]=await db.select({id:profiles.id}).from(profiles).where(eq(profiles.email,identity.email)).limit(1);userId=profile?.id}await db.insert(analyticsEvents).values({id:crypto.randomUUID(),userId,sessionKey:body.sessionKey?.slice(0,100),event:body.event,entityType:body.entityType?.slice(0,50),entityId:body.entityId?.slice(0,100),metadataJson:JSON.stringify(body.metadata??{})});return new Response(null,{status:204})}catch{return Response.json({error:"تعذر تسجيل الحدث"},{status:500})}}
