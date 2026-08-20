import { and,eq,isNull } from "drizzle-orm";
import { getDb } from "../../../../db";
import { communityComments,communityPosts,reports } from "../../../../db/pg-schema";
import { requireApiUser } from "../../../lib/authz";

type Body={entityType?:"community_post"|"community_comment";entityId?:string;reason?:string;details?:string};
export async function POST(request:Request){
 try{
  const user=await requireApiUser(),body=await request.json() as Body,entityType=body.entityType,entityId=body.entityId?.trim(),reason=body.reason?.trim()??"",details=body.details?.trim()||null;
  if(!entityType||!entityId||reason.length<3||reason.length>120)return Response.json({error:"اكتب سبب البلاغ بوضوح"},{status:400});
  const db=getDb();
  const exists=entityType==="community_post"
   ?await db.select({id:communityPosts.id}).from(communityPosts).where(and(eq(communityPosts.id,entityId),isNull(communityPosts.deletedAt))).limit(1)
   :await db.select({id:communityComments.id}).from(communityComments).where(and(eq(communityComments.id,entityId),isNull(communityComments.deletedAt))).limit(1);
  if(!exists.length)return Response.json({error:"المحتوى غير موجود"},{status:404});
  const duplicate=await db.select({id:reports.id}).from(reports).where(and(eq(reports.reporterId,user.id),eq(reports.entityType,entityType),eq(reports.entityId,entityId),eq(reports.status,"open"),isNull(reports.deletedAt))).limit(1);
  if(duplicate.length)return Response.json({ok:true,duplicate:true});
  const [report]=await db.insert(reports).values({id:crypto.randomUUID(),reporterId:user.id,entityType,entityId,reason,details,status:"open"}).returning({id:reports.id});
  return Response.json({ok:true,reportId:report.id},{status:201});
 }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر إرسال البلاغ"},{status:500})}
}
