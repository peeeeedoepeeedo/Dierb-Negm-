"use client";
import { FormEvent,useState } from "react";

export function StartMessage({recipientId,subject,returnTo}:{recipientId:string;subject:string;returnTo:string}){
 const [open,setOpen]=useState(false),[text,setText]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const body=text.trim();if(!body)return;setBusy(true);setMessage("");
  const r=await fetch("/api/messages",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({recipientId,subject,body})});
  if(r.status===401){location.href=`/login?returnTo=${encodeURIComponent(returnTo)}`;return}
  const data=await r.json();
  if(r.ok)location.href="/messages";else{setMessage(data.error||"تعذر إرسال الرسالة");setBusy(false)}
 }
 if(!open)return <button className="ghost" type="button" onClick={()=>setOpen(true)}>💬 راسل على ديرب</button>;
 return <form className="inline-message-form" onSubmit={submit}><textarea value={text} onChange={e=>setText(e.target.value)} minLength={1} maxLength={4000} required placeholder="اكتب رسالتك..."/><div><button type="button" className="ghost" onClick={()=>setOpen(false)}>إلغاء</button><button className="primary" disabled={busy||!text.trim()}>{busy?"جارٍ الإرسال...":"إرسال الرسالة"}</button></div>{message&&<p className="form-message error">{message}</p>}</form>;
}
