import { neon } from "@neondatabase/serverless";
if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is required");
const sql=neon(process.env.DATABASE_URL),now=new Date();
await sql`insert into system_settings (key,value,value_type,public,updated_at) values ('merchant_monthly_price_egp','149','number',true,${now}),('merchant_trial_days','30','number',true,${now}) on conflict (key) do nothing`;
await sql`insert into subscription_plans (id,code,name_ar,price,duration_days,trial_days,features_json,active,created_at,updated_at) values (${crypto.randomUUID()},'merchant-basic','الخطة الأساسية',149,30,30,'["store","products","orders"]',true,${now},${now}) on conflict (code) do nothing`;
console.log("System settings and the base merchant plan are ready.");
