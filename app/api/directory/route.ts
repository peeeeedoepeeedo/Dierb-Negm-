import { and,asc,eq,ilike,isNull,or,sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { categories,locations,serviceProfiles,stores } from "../../../db/pg-schema";
export async function GET(request:Request){
 const url=new URL(request.url),q=url.searchParams.get("q")?.trim()??"",locationId=url.searchParams.get("locationId")?.trim()??"",categoryId=url.searchParams.get("categoryId")?.trim()??"",type=url.searchParams.get("type")??"all",db=getDb(),pattern=`%${q.slice(0,100)}%`;
 const [locationRows,categoryRows]=await Promise.all([
  db.select({id:locations.id,parentId:locations.parentId,type:locations.type,name:locations.nameAr,slug:locations.slug}).from(locations).where(and(eq(locations.active,true),isNull(locations.deletedAt))).orderBy(asc(locations.sortOrder),asc(locations.nameAr)),
  db.select({id:categories.id,name:categories.nameAr,icon:categories.icon,entityType:categories.entityType}).from(categories).where(and(eq(categories.active,true),isNull(categories.deletedAt))).orderBy(asc(categories.sortOrder),asc(categories.nameAr))
 ]);
 const tasks:Promise<unknown>[]=[];
 if(type==="all"||type==="stores"){
  const clauses=[eq(stores.status,"active"),isNull(stores.deletedAt)];if(locationId)clauses.push(eq(stores.locationId,locationId));if(categoryId)clauses.push(eq(stores.categoryId,categoryId));if(q.length>=2)clauses.push(or(ilike(stores.name,pattern),ilike(stores.description,pattern),ilike(stores.address,pattern))!);
  tasks.push(db.select({id:stores.id,type:sql<string>`'store'`,slug:stores.slug,name:stores.name,subtitle:stores.description,phone:stores.phone,whatsapp:stores.whatsapp,address:stores.address,locationId:stores.locationId,categoryId:stores.categoryId,latitude:stores.latitude,longitude:stores.longitude,verified:stores.verified}).from(stores).where(and(...clauses)).limit(100));
 }
 if(type==="all"||type==="services"){
  const clauses=[eq(serviceProfiles.status,"active"),isNull(serviceProfiles.deletedAt)];if(locationId)clauses.push(eq(serviceProfiles.locationId,locationId));if(categoryId)clauses.push(eq(serviceProfiles.categoryId,categoryId));if(q.length>=2)clauses.push(or(ilike(serviceProfiles.name,pattern),ilike(serviceProfiles.profession,pattern),ilike(serviceProfiles.description,pattern))!);
  tasks.push(db.select({id:serviceProfiles.id,type:sql<string>`'service'`,name:serviceProfiles.name,subtitle:serviceProfiles.profession,description:serviceProfiles.description,phone:serviceProfiles.phone,whatsapp:serviceProfiles.whatsapp,locationId:serviceProfiles.locationId,categoryId:serviceProfiles.categoryId,verified:serviceProfiles.verified}).from(serviceProfiles).where(and(...clauses)).limit(100));
 }
 const groups=await Promise.all(tasks) as Array<Array<Record<string,unknown>>>;return Response.json({locations:locationRows,categories:categoryRows,results:groups.flat()});
}
