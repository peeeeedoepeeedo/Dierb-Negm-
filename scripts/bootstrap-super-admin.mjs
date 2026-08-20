import { neon } from "@neondatabase/serverless";
if(!process.env.DATABASE_URL||!process.env.SUPER_ADMIN_EMAIL)throw new Error("DATABASE_URL and SUPER_ADMIN_EMAIL are required");
const sql=neon(process.env.DATABASE_URL),email=process.env.SUPER_ADMIN_EMAIL.trim().toLowerCase(),rows=await sql`select id from profiles where email=${email} and status='active' limit 1`;
if(!rows[0])throw new Error("Create and verify the account first");
await sql`insert into user_roles (id,user_id,role,created_at) values (${crypto.randomUUID()},${rows[0].id},'super_admin',${new Date()}) on conflict (user_id,role) do nothing`;
await sql`insert into audit_logs (id,actor_id,action,entity_type,entity_id,metadata_json,created_at) values (${crypto.randomUUID()},${rows[0].id},'super_admin.bootstrap','profile',${rows[0].id},${JSON.stringify({source:"secure-cli"})},${new Date()})`;
console.log("Super Admin role granted to the existing active account.");
