import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
const url=process.env.DATABASE_URL;
test("PostgreSQL migrations and constraints are live",{skip:!url},async()=>{const sql=postgres(url,{max:2});try{const [{count}]=await sql`select count(*)::int as count from information_schema.tables where table_schema='public'`;assert.ok(count>=42);await assert.rejects(()=>sql`insert into profiles (id,email,status,created_at,updated_at) values ('constraint-audit','invalid@example.test','invalid',now(),now())`);const [{present}]=await sql`select exists(select 1 from pg_indexes where indexname='profiles_email_uq') as present`;assert.equal(present,true)}finally{await sql.end()}});
