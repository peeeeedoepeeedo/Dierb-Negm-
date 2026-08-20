"use client";
import { useCallback,useEffect,useMemo,useState } from "react";
type Location={id:string;parentId:string|null;type:string;name:string;slug:string};
type Row={id:string;type:"store"|"service";name:string;subtitle:string|null;description?:string|null;phone:string;whatsapp?:string|null;address?:string|null;locationId?:string|null;verified:boolean};
export function DirectoryBoard(){
 const [locations,setLocations]=useState<Location[]>([]),[rows,setRows]=useState<Row[]>([]),[q,setQ]=useState(""),[locationId,setLocationId]=useState(""),[type,setType]=useState("all"),[loading,setLoading]=useState(true);
 const load=useCallback(async()=>{setLoading(true);const p=new URLSearchParams();if(q.trim().length>=2)p.set("q",q.trim());if(locationId)p.set("locationId",locationId);if(type!=="all")p.set("type",type);const r=await fetch(`/api/directory?${p}`);if(r.ok){const data=await r.json();setLocations(data.locations);setRows(data.results)}setLoading(false)},[q,locationId,type]);
 useEffect(()=>{const t=setTimeout(()=>void load(),q?250:0);return()=>clearTimeout(t)},[load,q]);
 const nameById=useMemo(()=>Object.fromEntries(locations.map(x=>[x.id,x.name])),[locations]);
 const villages=locations.filter(x=>x.type==="village"||x.type==="city");
 return <>
  <section className="directory-controls"><div><span>⌕</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="اسم محل، دكتور، خدمة، مهنة..."/></div><select value={locationId} onChange={e=>setLocationId(e.target.value)}><option value="">كل ديرب نجم</option>{villages.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><select value={type} onChange={e=>setType(e.target.value)}><option value="all">الكل</option><option value="stores">متاجر وأنشطة</option><option value="services">خدمات ومهنيون</option></select></section>
  <section className="directory-locations"><h2>قرى ومناطق ديرب</h2><div>{villages.map(x=><button className={locationId===x.id?"active":""} key={x.id} onClick={()=>setLocationId(locationId===x.id?"":x.id)}>{x.name}</button>)}</div></section>
  <section className="directory-results"><div className="section-heading"><div><span className="kicker">دليل محلي حقيقي</span><h2>النتائج</h2></div><b>{loading?"جارٍ البحث...":`${rows.length} نتيجة`}</b></div>{!loading&&rows.length===0?<div className="empty"><span>📍</span><h3>لا توجد جهات منشورة بهذا البحث</h3><p>تظهر هنا الأنشطة والخدمات بعد اعتماد الإدارة.</p></div>:<div className="directory-grid">{rows.map(x=><article key={`${x.type}-${x.id}`}><header><span>{x.type==="store"?"🏪":"🛠️"}</span><div><small>{x.type==="store"?"نشاط تجاري":"مقدم خدمة"}{x.verified?" · موثّق ✓":""}</small><h3>{x.name}</h3></div></header><p>{x.subtitle||x.description||""}</p>{x.address&&<small>📍 {x.address}</small>}{x.locationId&&<small> • {nameById[x.locationId]||""}</small>}<footer><a href={`tel:${x.phone}`}>اتصال</a>{x.whatsapp&&<a href={`https://wa.me/2${x.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer">واتساب</a>}</footer></article>)}</div>}</section>
 </>;
}
