import assert from "node:assert/strict";
import { readFile,readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
async function files(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory())out.push(...await files(path));else if(/\.(ts|tsx|js|mjs|json)$/.test(entry.name))out.push(path)}return out}
test("runtime contains no Supabase dependency or browser database credential",async()=>{const paths=[...await files("app"),...await files("db"),"package.json"],contents=await Promise.all(paths.map(p=>readFile(p,"utf8")));for(let i=0;i<paths.length;i++){assert.doesNotMatch(contents[i],/supabase|service_role/i,paths[i]);if(contents[i].includes('"use client"'))assert.doesNotMatch(contents[i],/DATABASE_URL/)}});
test("private APIs derive identity on the server",async()=>{for(const path of ["app/api/orders/route.ts","app/api/messages/route.ts","app/api/notifications/route.ts","app/api/admin/stores/route.ts"]){const source=await readFile(path,"utf8");assert.match(source,/requireApiUser|requireRole/,path)}});
test("passwords use PBKDF2 and sessions use HttpOnly cookies",async()=>{assert.match(await readFile("app/lib/passwords.ts","utf8"),/PBKDF2/);assert.match(await readFile("app/lib/session-cookie.ts","utf8"),/HttpOnly/)});
