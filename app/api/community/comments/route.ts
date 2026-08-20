import { and,asc,eq,isNull } from "drizzle-orm";
import { getDb } from "../../../../db";
import { communityComments,communityPosts,profiles } from "../../../../db/pg-schema";
import { requireApiUser } from "../../../lib/authz";

export async function GET(request:Request){
 const postId=new URL(request.url).searchParams.get("postId")?.trim();
 if(!postId)return Response.json({error:"المنشور مطلوب"},{status:400});
 const rows=await getDb().select({id:communityComments.id,body:communityComments.body,authorId:communityComments.authorId,author:profiles.fullName,createdAt:communityComments.createdAt}).from(communityComments).innerJoin(profiles,eq(profiles.id,communityComments.authorId)).where(and(eq(communityComments.postId,postId),eq(communityComments.status,"published"),isNull(communityComments.deletedAt))).orderBy(asc(communityComments.createdAt)).limit(200);
 return Response.json({comments:rows});
}

export async function POST(request:Request){
 try{
  const user=await requireApiUser(),body=await request.json() as {postId?:string;body?:string},postId=body.postId?.trim(),content=body.body?.trim()??"";
  if(!postId||content.length<1||content.length>1000)return Response.json({error:"التعليق يجب أن يكون بين 1 و1000 حرف"},{status:400});
  const db=getDb(),[post]=await db.select({id:communityPosts.id}).from(communityPosts).where(and(eq(communityPosts.id,postId),eq(communityPosts.status,"published"),isNull(communityPosts.deletedAt))).limit(1);
  if(!post)return Response.json({error:"المنشور غير متاح"},{status:404});
  const [comment]=await db.insert(communityComments).values({id:crypto.randomUUID(),postId,authorId:user.id,body:content,status:"published"}).returning();
  return Response.json({comment:{...comment,author:user.fullName}},{status:201});
 }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر إضافة التعليق"},{status:500})}
}

export async function DELETE(request:Request){
 try{
  const user=await requireApiUser(),id=new URL(request.url).searchParams.get("id")?.trim();
  if(!id)return Response.json({error:"التعليق مطلوب"},{status:400});
  const rows=await getDb().update(communityComments).set({deletedAt:new Date(),updatedAt:new Date()}).where(and(eq(communityComments.id,id),eq(communityComments.authorId,user.id),isNull(communityComments.deletedAt))).returning({id:communityComments.id});
  return rows.length?Response.json({ok:true}):Response.json({error:"التعليق غير موجود أو لا تملك حذفه"},{status:404});
 }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر حذف التعليق"},{status:500})}
}
