export type UserRole="customer"|"merchant"|"service_provider"|"delivery"|"staff"|"moderator"|"admin"|"super_admin";
export type SessionUser={id:string;fullName:string|null;phone:string|null;roles:UserRole[]};
export type LocationSummary={id:string;nameAr:string;type:string};
export type CategorySummary={id:string;nameAr:string;slug:string;icon:string|null;entityType:string};
export type StoreSummary={id:string;name:string;slug:string;description:string|null;logoUrl:string|null;verified:boolean};
export type ProductSummary={id:string;storeId:string;storeName:string;name:string;description:string|null;imageUrl:string|null;price:number;unit:string;stock:number};
export type BootstrapPayload={locations:LocationSummary[];categories:CategorySummary[];featuredStores:StoreSummary[]};
export type CatalogPayload={stores:StoreSummary[];products:ProductSummary[]};
export function formatEgp(value:number){return new Intl.NumberFormat("ar-EG",{style:"currency",currency:"EGP"}).format(value)}
