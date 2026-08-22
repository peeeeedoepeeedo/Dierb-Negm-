export const colors={ink:"#102A36",primary:"#087454",primaryDark:"#055B42",accent:"#D7A936",background:"#F7FAF9",surface:"#FFFFFF",muted:"#60747C",border:"#DDE7E3",danger:"#B42318",success:"#067647"} as const;
export type Edition="customer"|"business"|"admin";
export const editions={customer:{name:"ديرب أونلاين",slug:"dierb-online",scheme:"dierbonline",androidPackage:"com.dierbonline.app"},business:{name:"ديرب بيزنس",slug:"dierb-business",scheme:"dierbbusiness",androidPackage:"com.dierbonline.business"},admin:{name:"ديرب أدمن",slug:"dierb-admin",scheme:"dierbadmin",androidPackage:"com.dierbonline.admin"}} as const;
export function apiBaseUrl(value:string|undefined){if(!value)throw new Error("EXPO_PUBLIC_API_BASE_URL is required");return value.replace(/\/$/,"")}
