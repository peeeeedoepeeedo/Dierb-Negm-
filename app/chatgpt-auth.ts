import { and, eq, gt, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../db";
import { authSessions, profiles } from "../db/pg-schema";
import { tokenHash } from "./lib/passwords";
import { SESSION_COOKIE } from "./lib/session-cookie";
export type ChatGPTUser={email:string;fullName:string|null;displayName:string};
function cookieValue(header:string|null,name:string){return header?.split(";").map(v=>v.trim()).find(v=>v.startsWith(`${name}=`))?.slice(name.length+1)??null}
export async function getChatGPTUser():Promise<ChatGPTUser|null>{const requestHeaders=await headers(),token=cookieValue(requestHeaders.get("cookie"),SESSION_COOKIE);if(!token)return null;const hash=await tokenHash(token),db=getDb(),[row]=await db.select({email:profiles.email,fullName:profiles.fullName,status:profiles.status}).from(authSessions).innerJoin(profiles,eq(profiles.id,authSessions.userId)).where(and(eq(authSessions.tokenHash,hash),gt(authSessions.expiresAt,new Date()),isNull(authSessions.revokedAt))).limit(1);if(!row||row.status!=="active")return null;return{email:row.email,fullName:row.fullName,displayName:row.fullName??row.email}}
export async function requireChatGPTUser(returnTo:string){const user=await getChatGPTUser();if(user)return user;redirect(`/login?returnTo=${encodeURIComponent(returnTo.startsWith("/")?returnTo:"/")}`)}
export function chatGPTSignInPath(returnTo:string){return `/login?returnTo=${encodeURIComponent(returnTo)}`}
export function chatGPTSignOutPath(returnTo="/"){return `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`}
