import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./pg-schema";
let client:ReturnType<typeof postgres>|null=null;
let database:ReturnType<typeof drizzle<typeof schema>>|null=null;
export function getNodeDb(){if(database)return database;const url=process.env.DATABASE_URL;if(!url)throw new Error("DATABASE_URL is required");client=postgres(url,{max:Number(process.env.DATABASE_POOL_SIZE??10),idle_timeout:20,connect_timeout:10,prepare:true});database=drizzle(client,{schema});return database}
export async function closeNodeDb(){if(client){await client.end();client=null;database=null}}
