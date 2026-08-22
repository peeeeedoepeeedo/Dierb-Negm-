import type{BootstrapPayload,CatalogPayload,SessionUser}from"@dierb/domain";
export type TokenPair={accessToken:string;refreshToken:string};
export interface TokenStore{read():Promise<TokenPair|null>;write(value:TokenPair):Promise<void>;clear():Promise<void>}
export class ApiError extends Error{constructor(readonly status:number,readonly code:string,message:string){super(message);this.name="ApiError"}}
type SuccessEnvelope<T>={success:true;data:T;meta:{requestId:string;timestamp:string}};
type FailureEnvelope={success:false;error:{code:string;message:string};meta:{requestId:string;timestamp:string}};
export class DierbApiClient{
 private refreshing:Promise<boolean>|null=null;
 constructor(private readonly baseUrl:string,private readonly tokens:TokenStore,private readonly fetcher:typeof fetch=fetch){}
 async request<T>(path:string,init:RequestInit={},retry=true):Promise<T>{const pair=await this.tokens.read(),headers=new Headers(init.headers);headers.set("accept","application/json");if(init.body)headers.set("content-type","application/json");if(pair?.accessToken)headers.set("authorization",`Bearer ${pair.accessToken}`);const response=await this.fetcher(`${this.baseUrl}/api/v1${path}`,{...init,headers});if(response.status===401&&retry&&pair?.refreshToken&&await this.refresh(pair.refreshToken))return this.request<T>(path,init,false);const payload=await response.json().catch(()=>null) as SuccessEnvelope<T>|FailureEnvelope|null;if(!response.ok||!payload||payload.success===false){const failure=payload&&payload.success===false?payload.error:null;throw new ApiError(response.status,failure?.code??"REQUEST_FAILED",failure?.message??"تعذر الاتصال بالخدمة")}return payload.data}
 private async refresh(refreshToken:string){if(this.refreshing)return this.refreshing;this.refreshing=(async()=>{const response=await this.fetcher(`${this.baseUrl}/api/v1/auth/refresh`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({refreshToken})});if(!response.ok){await this.tokens.clear();return false}await this.tokens.write(await response.json() as TokenPair);return true})().finally(()=>{this.refreshing=null});return this.refreshing}
 bootstrap=()=>this.request<BootstrapPayload>("/bootstrap");
 catalog=()=>this.request<CatalogPayload>("/catalog");
 me=()=>this.request<SessionUser>("/me");
}
