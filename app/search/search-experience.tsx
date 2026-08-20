"use client";
import Link from "next/link";
import { FormEvent,useEffect,useState } from "react";
type Result={id:string;type:string;title:string;description:string|null};
const types=[["all","الكل"],["locations","القرى والمناطق"],["stores","المتاجر"],["products","المنتجات"],["services","الخدمات"],["questions","اسأل ديرب"],["listings","الإعلانات والعقارات والسيارات والوظائف"]];
const hrefFor=(r:Result)=>r.type==="location"?"/directory":r.type==="store"?`/store/${r.id}`:r.type==="product"?`/product/${r.id}`:r.type==="service"?`/services/${r.id}`:r.type==="question"?"/ask":r.type==="car"?"/cars":r.type==="property"?"/real-estate":r.type==="job"?"/jobs":"/listings";
const labelFor=(type:string)=>({location:"منطقة",store:"متجر",product:"منتج",service:"خدمة",question:"سؤال",car:"سيارة",property:"عقار",job:"وظيفة",classified:"إعلان"}[type]||type);
export function SearchExperience({initialQuery=""}:{initialQuery?:string}){
 const [query,setQuery]=useState(initialQuery),[type,setType]=useState("all"),[rows,setRows]=useState<Result[]>([]),[searched,setSearched]=useState(false),[busy,setBusy]=useState(initialQuery.trim().length>=2),[error,setError]=useState("");
 async function run(q:string,t:string,remember=true){if(q.trim().length<2){setError("اكتب حرفين على الأقل");return}setBusy(true);setError("");const r=await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&type=${t}`),d=await r.json();if(r.ok){setRows(d.results);setSearched(true);if(remember)void fetch("/api/search",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({query:q,filters:{type:t}})})}else setError(d.error||"تعذر البحث");setBusy(false)}
 useEffect(()=>{
  const q=initialQuery.trim();if(q.length<2)return;
  let active=true;
  fetch(`/api/search?q=${encodeURIComponent(q)}&type=all`)
   .then(async r=>({ok:r.ok,data:await r.json()}))
   .then(({ok,data})=>{if(!active)return;if(ok){setRows(data.results);setSearched(true)}else setError(data.error||"تعذر البحث");setBusy(false)})
   .catch(()=>{if(active){setError("تعذر البحث");setBusy(false)}});
  return()=>{active=false};
 },[initialQuery]);
 async function submit(e:FormEvent){e.preventDefault();await run(query,type)}
 return <section><span className="kicker">بحث شامل</span><h1>دوّر في ديرب كلها</h1><p>البحث يشمل القرى، الأنشطة، المنتجات، الخدمات، أسئلة أهل ديرب، السيارات، العقارات والوظائف.</p><form className="market-search" onSubmit={submit}><input value={query} onChange={e=>setQuery(e.target.value)} minLength={2} maxLength={100} aria-label="كلمة البحث" placeholder="متجر، قرية، دكتور، منتج، وظيفة..."/><select value={type} onChange={e=>setType(e.target.value)} aria-label="نوع النتائج">{types.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select><button className="primary" disabled={busy}>{busy?"جارٍ البحث...":"بحث"}</button></form>{error&&<p className="form-message error">{error}</p>}{searched&&rows.length===0?<div className="empty"><span>🔎</span><h3>لا توجد نتائج مطابقة</h3><p>جرّب كلمة أو تصنيفًا آخر.</p></div>:<div className="question-list">{rows.map(r=><Link href={hrefFor(r)} key={`${r.type}-${r.id}`}><article><small>{labelFor(r.type)}</small><h2>{r.title}</h2><p>{r.description||"فتح القسم لمزيد من التفاصيل"}</p><b>عرض ←</b></article></Link>)}</div>}</section>;
}
