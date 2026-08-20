export const SESSION_COOKIE="derb_session";
export function sessionCookie(token:string,maxAge=60*60*24*30){return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV==="production"?"; Secure":""}`}
export function clearSessionCookie(){return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV==="production"?"; Secure":""}`}
