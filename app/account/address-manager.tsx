"use client";
import { FormEvent,useEffect,useState } from "react";
type Location={id:string;name:string;type:string};
type Address={id:string;label:string;street:string;building:string|null;floor:string|null;apartment:string|null;landmark:string|null;locationId:string|null;locationName:string|null;isDefault:boolean};

export function AddressManager(){
 const [rows,setRows]=useState<Address[]>([]),[locations,setLocations]=useState<Location[]>([]),[busy,setBusy]=useState(""),[message,setMessage]=useState("");
 async function load(){
  const [a,t]=await Promise.all([fetch("/api/addresses"),fetch("/api/taxonomy")]);
  if(a.ok)setRows((await a.json()).addresses);
  if(t.ok)setLocations(((await t.json()).locations as Location[]).filter(x=>x.type==="city"||x.type==="village"));
 }
 useEffect(()=>{
  let active=true;
  Promise.all([fetch("/api/addresses"),fetch("/api/taxonomy")])
   .then(async([a,t])=>({addresses:a.ok?(await a.json()).addresses as Address[]:[],locations:t.ok?((await t.json()).locations as Location[]).filter(x=>x.type==="city"||x.type==="village"):[]}))
   .then(data=>{if(active){setRows(data.addresses);setLocations(data.locations)}})
   .catch(()=>{if(active)setMessage("تعذر تحميل العناوين")});
  return()=>{active=false};
 },[]);
 async function add(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy("add");setMessage("");const form=e.currentTarget,r=await fetch("/api/addresses",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))}),data=await r.json();if(r.ok){form.reset();setMessage("تم حفظ العنوان.");await load()}else setMessage(data.error||"تعذر حفظ العنوان");setBusy("")}
 async function makeDefault(id:string){setBusy(id);const r=await fetch("/api/addresses",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,isDefault:true})});if(r.ok)await load();else setMessage((await r.json()).error);setBusy("")}
 async function remove(id:string){if(!confirm("حذف هذا العنوان؟"))return;setBusy(id);const r=await fetch(`/api/addresses?id=${encodeURIComponent(id)}`,{method:"DELETE"});if(r.ok)await load();else setMessage((await r.json()).error);setBusy("")}
 return <section className="form-card" id="addresses"><div><span className="kicker">التوصيل</span><h2>عناويني</h2><p>اربط عنوانك بالمدينة أو القرية علشان الطلب والتوصيل يبقوا واضحين.</p></div><div className="data-table">{rows.length===0?<p>لم تضف عنوانًا بعد.</p>:rows.map(a=><article key={a.id}><div><b>{a.label}{a.isDefault?" · افتراضي ✓":""}</b><small>{a.locationName?`${a.locationName} · `:""}{a.street}{a.building?` · مبنى ${a.building}`:""}{a.floor?` · دور ${a.floor}`:""}</small></div><div>{!a.isDefault&&<button disabled={!!busy} onClick={()=>makeDefault(a.id)}>اجعله الافتراضي</button>}<button className="reject" disabled={!!busy} onClick={()=>remove(a.id)}>حذف</button></div></article>)}</div><form onSubmit={add}><label>اسم العنوان<input name="label" required minLength={2} placeholder="البيت / الشغل"/></label><label>القرية/المدينة<select name="locationId" required defaultValue=""><option value="" disabled>اختر المكان</option>{locations.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><label className="full">الشارع والعنوان<input name="street" required minLength={5} placeholder="اسم الشارع وأقرب علامة"/></label><label>المبنى<input name="building"/></label><label>الدور<input name="floor"/></label><label>الشقة<input name="apartment"/></label><label>علامة مميزة<input name="landmark"/></label><label><input name="isDefault" type="checkbox" value="true"/> اجعله العنوان الافتراضي</label><button className="primary" disabled={busy==="add"}>{busy==="add"?"جارٍ الحفظ...":"إضافة العنوان"}</button>{message&&<p className="form-message ok">{message}</p>}</form></section>;
}
