import { env } from "cloudflare:workers";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./pg-schema";

let database:ReturnType<typeof drizzle<typeof schema>>|null=null;
export function getDb(){if(database)return database;const url=(env as unknown as {DATABASE_URL?:string}).DATABASE_URL;if(!url)throw new Error("DATABASE_URL is required by the server runtime");database=drizzle(neon(url),{schema});return database}
