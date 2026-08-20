const encoder=new TextEncoder();
function toBase64(bytes:Uint8Array){let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary)}
function fromBase64(value:string){const binary=atob(value),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes}
export async function hashPassword(password:string,saltBytes=crypto.getRandomValues(new Uint8Array(16)),iterations=310000){const key=await crypto.subtle.importKey("raw",encoder.encode(password),"PBKDF2",false,["deriveBits"]),bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:saltBytes,iterations},key,256);return{hash:toBase64(new Uint8Array(bits)),salt:toBase64(saltBytes),iterations}}
export async function verifyPassword(password:string,salt:string,iterations:number,expected:string){const result=await hashPassword(password,fromBase64(salt),iterations),a=encoder.encode(result.hash),b=encoder.encode(expected);if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0}
export async function tokenHash(token:string){const bytes=await crypto.subtle.digest("SHA-256",encoder.encode(token));return toBase64(new Uint8Array(bytes))}
export function secureToken(){return toBase64(crypto.getRandomValues(new Uint8Array(32))).replaceAll("+","-").replaceAll("/","_").replaceAll("=","")}
