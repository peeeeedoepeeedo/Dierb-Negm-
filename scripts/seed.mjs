import postgres from "postgres";
if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is required");
const sql=postgres(process.env.DATABASE_URL,{max:1,prepare:false}),now=new Date();

await sql`insert into system_settings (key,value,value_type,public,updated_at) values ('merchant_monthly_price_egp','149','number',true,${now}),('merchant_trial_days','30','number',true,${now}) on conflict (key) do update set value=excluded.value,value_type=excluded.value_type,public=excluded.public,updated_at=excluded.updated_at`;
await sql`insert into subscription_plans (id,code,name_ar,price,duration_days,trial_days,features_json,active,created_at,updated_at) values ('plan-merchant-basic','merchant-basic','الخطة الأساسية',149,30,30,'["store","products","orders"]',true,${now},${now}) on conflict (code) do update set name_ar=excluded.name_ar,price=excluded.price,duration_days=excluded.duration_days,trial_days=excluded.trial_days,features_json=excluded.features_json,active=true,updated_at=excluded.updated_at`;

// Official administrative division of Dierb Nigm, Sharqia Governorate:
// https://www.sharkia.gov.eg/areas/dyarb/division.aspx?ID=1
const roots=[
 {id:"loc-sharkia",parentId:null,type:"governorate",name:"الشرقية",slug:"sharkia",sort:1},
 {id:"loc-dierb-center",parentId:"loc-sharkia",type:"center",name:"مركز ديرب نجم",slug:"dierb-nigm",sort:1},
 {id:"loc-dierb-city",parentId:"loc-dierb-center",type:"city",name:"مدينة ديرب نجم",slug:"dierb-nigm-city",sort:1},
];
const villages=[
 ["الصانية","elsania"],["برمكيم","barmakeem"],["جميزة بني عمرو","gameza-bani-amr"],["الصويني","elsoweiny"],
 ["دبيج","debeeg"],
 ["صافور","safoor"],["المنا صافور","el-mana-safoor"],["طحا المرج","taha-el-marj"],["ديرب السوق","dierb-el-souq"],["كفر أبو بري","kafr-abu-bari"],["الجواشنة","el-gawashna"],["الميساه","el-maysa"],["منشأة كشك","manshaet-keshk"],["منشية عودة سالم","manshiyet-awda-salem"],
 ["قرموط صهبرة","qarmout-sahbara"],["حصة الرهبان","hesset-el-rohban"],["شبرا صورة","shubra-soura"],["كفر اللبا","kafr-el-labba"],["كفر العكل","kafr-el-akl"],["الهوابر","el-hawaber"],["أبو عيد","abu-eid"],["صهبرة","sahbara"],["منشأة صهبرة","manshaet-sahbara"],
 ["أبو متنا","abu-matna"],["بهنيا","bahnaya"],["كراديس","karadees"],
 ["صفط زريق","saft-zureiq"],["القطايع","el-qataie"],["المجفف","el-mogaffaf"],["إكوة","ekwa"],["كفر الباشا","kafr-el-basha"],["فرغان","farghan"],["شنبارة منقلا","shanbara-menqala"],["منشأة صفوت","manshaet-safwat"],["تل القاضي","tal-el-qadi"],["كفر الجندي","kafr-el-gendy"],
 ["العصايد","el-asayed"],["المناحريت","el-manahreet"],["إكراش","ekrash"],["قاويشة","qawisha"],["العطارين","el-attareen"],["منشأة قاسم","manshaet-qasem"],["شوبك إكراش","shobak-ekrash"],["كفر الحاج حسن","kafr-el-hag-hassan"],
];
for(const item of roots){await sql`insert into locations (id,parent_id,type,name_ar,slug,active,sort_order,created_at,updated_at) values (${item.id},${item.parentId},${item.type},${item.name},${item.slug},true,${item.sort},${now},${now}) on conflict (id) do update set parent_id=excluded.parent_id,type=excluded.type,name_ar=excluded.name_ar,slug=excluded.slug,active=true,sort_order=excluded.sort_order,updated_at=excluded.updated_at`}
for(let i=0;i<villages.length;i++){const [name,slug]=villages[i],id=`loc-dierb-v-${String(i+1).padStart(2,"0")}`;await sql`insert into locations (id,parent_id,type,name_ar,slug,active,sort_order,created_at,updated_at) values (${id},'loc-dierb-center','village',${name},${slug},true,${i+10},${now},${now}) on conflict (id) do update set parent_id=excluded.parent_id,type=excluded.type,name_ar=excluded.name_ar,slug=excluded.slug,active=true,sort_order=excluded.sort_order,updated_at=excluded.updated_at`}

await sql.end();
console.log(`System settings, merchant plan, and ${villages.length} official Dierb Nigm villages are ready.`);
