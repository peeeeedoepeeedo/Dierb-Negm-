import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { notificationPreferences, notifications } from "../../db/pg-schema";

export async function createNotification(input:{userId:string;type:string;title:string;body:string;entityType?:string;entityId?:string}){const db=getDb();const pref=await db.select({inApp:notificationPreferences.inApp}).from(notificationPreferences).where(and(eq(notificationPreferences.userId,input.userId),eq(notificationPreferences.type,input.type))).limit(1);if(pref[0]?.inApp===false)return null;const [row]=await db.insert(notifications).values({id:crypto.randomUUID(),userId:input.userId,type:input.type,title:input.title,body:input.body,entityType:input.entityType,entityId:input.entityId}).returning();return row}
