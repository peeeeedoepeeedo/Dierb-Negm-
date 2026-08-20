import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { profiles, userRoles } from "../../db/pg-schema";
import { getChatGPTUser } from "../chatgpt-auth";

export async function requireApiUser(){
  const identity=await getChatGPTUser();
  if(!identity) throw new Response(JSON.stringify({error:"يجب تسجيل الدخول"}),{status:401,headers:{"content-type":"application/json"}});
  const db=getDb();
  let profile=await db.query.profiles.findFirst({where:eq(profiles.email,identity.email)});
  if(!profile){
    const id=crypto.randomUUID();
    [profile]=await db.insert(profiles).values({id,email:identity.email,fullName:identity.fullName}).returning();
    await db.insert(userRoles).values({id:crypto.randomUUID(),userId:id,role:"customer"});
  }
  if(profile.status!=="active") throw new Response(JSON.stringify({error:"الحساب غير نشط"}),{status:403,headers:{"content-type":"application/json"}});
  return profile;
}

export async function requireRole(allowed:Array<typeof userRoles.$inferSelect.role>){
  const profile=await requireApiUser(); const db=getDb();
  const roles=await db.select().from(userRoles).where(and(eq(userRoles.userId,profile.id)));
  if(!roles.some(r=>allowed.includes(r.role))) throw new Response(JSON.stringify({error:"ليس لديك صلاحية"}),{status:403,headers:{"content-type":"application/json"}});
  return profile;
}
