import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./pg-schema";

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
  database=drizzle(neon(resolved.value),{schema});
  return database;
}

export async function closeNodeDb(){database=null}
