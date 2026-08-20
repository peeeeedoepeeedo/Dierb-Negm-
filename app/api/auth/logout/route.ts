import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { authSessions } from "../../../../db/pg-schema";
import { tokenHash } from "../../../lib/passwords";
import { clearSessionCookie, SESSION_COOKIE } from "../../../lib/session-cookie";
function cookieValue(header:string|null){return header?.split(";").map(v=>v.trim()).find(v=>v.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length+1)??null}
export async function GET(request:Request){const token=cookieValue(request.headers.get("cookie"));if(token){const db=getDb();await db.update(authSessions).set({revokedAt:new Date()}).where(eq(authSessions.tokenHash,await tokenHash(token)))}const url=new URL(request.url),target=url.searchParams.get("returnTo")||"/";return new Response(null,{status:303,headers:{location:target.startsWith("/")?target:"/","set-cookie":clearSessionCookie()}})}
