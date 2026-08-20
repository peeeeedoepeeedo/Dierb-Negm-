import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { authCredentials, authSessions, profiles, userRoles } from "../../../../db/pg-schema";
import { hashPassword, secureToken, tokenHash } from "../../../lib/passwords";
import { sessionCookie } from "../../../lib/session-cookie";

export async function POST(request:Request){
  try{
    const body=await request.json() as {email?:string;password?:string;confirmPassword?:string;fullName?:string;phone?:string;acceptTerms?:string|boolean};
    const email=body.email?.trim().toLowerCase()??"",password=body.password??"",fullName=body.fullName?.trim()??"",phone=body.phone?.trim()??"";
    if(!/^\S+@\S+\.\S+$/.test(email)||password.length<10||fullName.length<2)return Response.json({error:"أدخل اسمًا وبريدًا صحيحًا وكلمة مرور من 10 أحرف على الأقل"},{status:400});
    if(body.confirmPassword!==password)return Response.json({error:"تأكيد كلمة المرور غير مطابق"},{status:400});
    if(!/^01[0125][0-9]{8}$/.test(phone))return Response.json({error:"أدخل رقم هاتف مصريًا صحيحًا"},{status:400});
    if(body.acceptTerms!==true&&body.acceptTerms!=="true")return Response.json({error:"يجب الموافقة على الشروط وسياسة الخصوصية"},{status:400});
    const db=getDb();
    const exists=await db.select({id:profiles.id}).from(profiles).where(eq(profiles.email,email)).limit(1);
    if(exists.length)return Response.json({error:"البريد مستخدم بالفعل"},{status:409});
    const userId=crypto.randomUUID(),credential=await hashPassword(password),token=secureToken(),hash=await tokenHash(token),expiresAt=new Date(Date.now()+30*86400000);
    await db.transaction(async(tx)=>{
      await tx.insert(profiles).values({id:userId,email,fullName,phone,status:"active"});
      await tx.insert(userRoles).values({id:crypto.randomUUID(),userId,role:"customer"});
      await tx.insert(authCredentials).values({id:crypto.randomUUID(),userId,passwordHash:credential.hash,passwordSalt:credential.salt,iterations:credential.iterations});
      await tx.insert(authSessions).values({id:crypto.randomUUID(),userId,tokenHash:hash,userAgent:request.headers.get("user-agent"),expiresAt});
    });
    return Response.json({ok:true},{status:201,headers:{"set-cookie":sessionCookie(token)}});
  }catch{return Response.json({error:"تعذر إنشاء الحساب"},{status:500})}
}
