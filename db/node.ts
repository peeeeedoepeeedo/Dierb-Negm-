import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./pg-schema";

let client:ReturnType<typeof postgres>|null=null;
let database:ReturnType<typeof drizzle<typeof schema>>|null=null;

const databaseEnvCandidates=[
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function getDatabaseUrlEnv(){
  for(const key of databaseEnvCandidates){
    const value=process.env[key];
    if(value)return {key,value};
  }
  return null;
}

export function getNodeDb(){
  if(database)return database;
  const resolved=getDatabaseUrlEnv();
  if(!resolved)throw new Error("Database connection environment is required");
  client=postgres(resolved.value,{max:Number(process.env.DATABASE_POOL_SIZE??10),idle_timeout:20,connect_timeout:10,prepare:true});
  database=drizzle(client,{schema});
  return database;
}

export async function closeNodeDb(){if(client){await client.end();client=null;database=null}}
