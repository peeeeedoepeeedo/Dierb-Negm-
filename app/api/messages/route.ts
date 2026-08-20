import { and, asc, desc, eq, isNull, ne, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { conversationMembers, conversations, messages, profiles } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";
import { createNotification } from "../../lib/notifications";

export async function GET(request:Request){try{const user=await requireApiUser(),conversationId=new URL(request.url).searchParams.get("conversationId"),db=getDb();if(!conversationId){const rows=await db.select({id:conversations.id,subject:conversations.subject,updatedAt:conversations.updatedAt,lastMessage:sql<string|null>`(select body from messages where conversation_id=${conversations.id} and deleted_at is null order by created_at desc limit 1)`,lastMessageAt:sql<number|null>`(select created_at from messages where conversation_id=${conversations.id} and deleted_at is null order by created_at desc limit 1)`,unreadCount:sql<number>`(select count(*) from messages where conversation_id=${conversations.id} and sender_id!=${user.id} and deleted_at is null and (${conversationMembers.lastReadAt} is null or created_at>${conversationMembers.lastReadAt}))`,otherName:sql<string|null>`(select p.full_name from conversation_members cm join profiles p on p.id=cm.user_id where cm.conversation_id=${conversations.id} and cm.user_id!=${user.id} limit 1)`}).from(conversations).innerJoin(conversationMembers,and(eq(conversationMembers.conversationId,conversations.id),eq(conversationMembers.userId,user.id))).where(isNull(conversations.deletedAt)).orderBy(desc(conversations.updatedAt)).limit(100);return Response.json({conversations:rows})}const member=await db.select({id:conversationMembers.id}).from(conversationMembers).where(and(eq(conversationMembers.conversationId,conversationId),eq(conversationMembers.userId,user.id))).limit(1);if(!member.length)return Response.json({error:"لا تملك صلاحية هذه المحادثة"},{status:403});const rows=await db.select({id:messages.id,body:messages.body,createdAt:messages.createdAt,senderId:messages.senderId,sender:profiles.fullName}).from(messages).innerJoin(profiles,eq(profiles.id,messages.senderId)).where(and(eq(messages.conversationId,conversationId),isNull(messages.deletedAt))).orderBy(asc(messages.createdAt)).limit(300);await db.update(conversationMembers).set({lastReadAt:new Date()}).where(and(eq(conversationMembers.conversationId,conversationId),eq(conversationMembers.userId,user.id)));return Response.json({messages:rows,currentUserId:user.id})}catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر تحميل الرسائل"},{status:500})}}

export async function POST(request:Request){
  try{
    const user=await requireApiUser(),body=await request.json() as {conversationId?:string;recipientId?:string;subject?:string;body?:string},content=body.body?.trim()??"",db=getDb();
    if(content.length<1||content.length>4000)return Response.json({error:"الرسالة غير صالحة"},{status:400});
    let conversationId=body.conversationId;
    if(conversationId){
      const member=await db.select({id:conversationMembers.id}).from(conversationMembers).where(and(eq(conversationMembers.conversationId,conversationId),eq(conversationMembers.userId,user.id))).limit(1);
      if(!member.length)return Response.json({error:"لا تملك صلاحية هذه المحادثة"},{status:403});
    }else{
      if(!body.recipientId||body.recipientId===user.id)return Response.json({error:"المستلم غير صالح"},{status:400});
      const recipient=await db.select({id:profiles.id}).from(profiles).where(and(eq(profiles.id,body.recipientId),eq(profiles.status,"active"))).limit(1);
      if(!recipient.length)return Response.json({error:"المستلم غير متاح"},{status:404});
      conversationId=crypto.randomUUID();
      const createdId=conversationId;
      await db.transaction(async(tx)=>{
        await tx.insert(conversations).values({id:createdId,createdBy:user.id,subject:body.subject?.trim()||null});
        await tx.insert(conversationMembers).values({id:crypto.randomUUID(),conversationId:createdId,userId:user.id});
        await tx.insert(conversationMembers).values({id:crypto.randomUUID(),conversationId:createdId,userId:body.recipientId!});
      });
    }
    const [message]=await db.insert(messages).values({id:crypto.randomUUID(),conversationId,senderId:user.id,body:content}).returning();
    await db.update(conversations).set({updatedAt:new Date()}).where(eq(conversations.id,conversationId));
    const recipients=await db.select({userId:conversationMembers.userId}).from(conversationMembers).where(and(eq(conversationMembers.conversationId,conversationId),ne(conversationMembers.userId,user.id)));
    await Promise.all(recipients.map(r=>createNotification({userId:r.userId,type:"message_new",title:"رسالة جديدة",body:`لديك رسالة جديدة من ${user.fullName??"مستخدم ديرب"}`,entityType:"conversation",entityId:conversationId})));
    return Response.json({message,conversationId},{status:201});
  }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر إرسال الرسالة"},{status:500})}
}
