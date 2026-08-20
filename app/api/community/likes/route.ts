import { and,eq,isNull,sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { communityLikes,communityPosts } from "../../../../db/pg-schema";
import { requireApiUser } from "../../../lib/authz";

async function likeCount(postId:string){const [{count}]=await getDb().select({count:sql<number>`count(*)`}).from(communityLikes).where(eq(communityLikes.postId,postId));return Number(count)}

export async function POST(request:Request){
 try{
  const user=await requireApiUser(),body=await request.json() as {postId?:string},postId=body.postId?.trim();
  if(!postId)return Response.json({error:"المنشور مطلوب"},{status:400});
  const db=getDb(),[post]=await db.select({id:communityPosts.id}).from(communityPosts).where(and(eq(communityPosts.id,postId),eq(communityPosts.status,"published"),isNull(communityPosts.deletedAt))).limit(1);
  if(!post)return Response.json({error:"المنشور غير متاح"},{status:404});
  await db.insert(communityLikes).values({id:crypto.randomUUID(),postId,userId:user.id}).onConflictDoNothing();
  return Response.json({liked:true,count:await likeCount(postId)});
 }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر تسجيل الإعجاب"},{status:500})}
}

export async function DELETE(request:Request){
 try{
  const user=await requireApiUser(),postId=new URL(request.url).searchParams.get("postId")?.trim();
  if(!postId)return Response.json({error:"المنشور مطلوب"},{status:400});
  await getDb().delete(communityLikes).where(and(eq(communityLikes.postId,postId),eq(communityLikes.userId,user.id)));
  return Response.json({liked:false,count:await likeCount(postId)});
 }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر إلغاء الإعجاب"},{status:500})}
}
