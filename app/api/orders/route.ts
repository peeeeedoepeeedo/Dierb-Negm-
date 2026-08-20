import { and, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { addresses,couponRedemptions,coupons,inventoryMovements,orderItems,orders,orderStatusHistory,products,stores } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";
import { createNotification } from "../../lib/notifications";
type OrderInput={storeId?:string;addressId?:string;notes?:string;couponCode?:string;items?:Array<{productId:string;quantity:number}>};

export async function POST(request:Request){
  try{
    const user=await requireApiUser(),body=await request.json() as OrderInput;
    if(!body.storeId||!body.addressId||!Array.isArray(body.items)||!body.items.length)return Response.json({error:"بيانات الطلب غير مكتملة"},{status:400});
    const cleaned=body.items.map(i=>({productId:String(i.productId),quantity:Number(i.quantity)}));
    if(cleaned.some(i=>!i.productId||!Number.isInteger(i.quantity)||i.quantity<1))return Response.json({error:"كميات الطلب غير صحيحة"},{status:400});
    const db=getDb();
    const [address]=await db.select({id:addresses.id}).from(addresses).where(and(eq(addresses.id,body.addressId),eq(addresses.userId,user.id))).limit(1);
    if(!address)return Response.json({error:"العنوان لا يخص هذا الحساب"},{status:403});
    const rows=await db.select().from(products).where(and(inArray(products.id,cleaned.map(i=>i.productId)),eq(products.storeId,body.storeId),eq(products.active,true)));
    if(rows.length!==new Set(cleaned.map(i=>i.productId)).size)return Response.json({error:"أحد المنتجات غير متاح أو يتبع متجرًا آخر"},{status:409});
    let subtotal=0;
    for(const item of cleaned){const product=rows.find(p=>p.id===item.productId)!;if(product.stock<item.quantity)return Response.json({error:`الكمية المطلوبة من ${product.name} غير متاحة`},{status:409});subtotal+=product.price*item.quantity}
    let couponId:string|null=null,discount=0;
    const now=new Date();
    if(body.couponCode?.trim()){
      const [coupon]=await db.select().from(coupons).where(and(eq(coupons.storeId,body.storeId),eq(coupons.code,body.couponCode.trim().toUpperCase()),eq(coupons.active,true))).limit(1);
      if(!coupon||coupon.startsAt>now||coupon.endsAt<now)return Response.json({error:"الكوبون غير صالح أو منتهي"},{status:409});
      if(subtotal<coupon.minimumOrder)return Response.json({error:`الحد الأدنى للكوبون ${coupon.minimumOrder} ج`},{status:409});
      const uses=await db.select().from(couponRedemptions).where(eq(couponRedemptions.couponId,coupon.id));
      const userUses=uses.filter(x=>x.userId===user.id).length;
      if(coupon.usageLimit!==null&&uses.length>=coupon.usageLimit)return Response.json({error:"تم استنفاد الكوبون"},{status:409});
      if(userUses>=coupon.perUserLimit)return Response.json({error:"وصلت للحد المسموح لهذا الكوبون"},{status:409});
      const raw=coupon.discountType==="percentage"?subtotal*coupon.discountValue/100:coupon.discountValue;
      discount=Math.min(subtotal,coupon.maximumDiscount===null?raw:Math.min(raw,coupon.maximumDiscount));
      couponId=coupon.id;
    }
    const deliveryFee=0,total=subtotal-discount+deliveryFee,id=crypto.randomUUID(),number=`DRB-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    await db.transaction(async(tx)=>{
      await tx.insert(orders).values({id,orderNumber:number,customerId:user.id,storeId:body.storeId!,addressId:body.addressId!,status:"pending",subtotal,discount,deliveryFee,total,notes:body.notes?.trim()||null,createdAt:now,updatedAt:now});
      for(const item of cleaned){
        const product=rows.find(p=>p.id===item.productId)!;
        const updated=await tx.update(products).set({stock:product.stock-item.quantity,updatedAt:now}).where(and(eq(products.id,product.id),eq(products.stock,product.stock))).returning({id:products.id});
        if(!updated.length)throw new Response(JSON.stringify({error:`تغير مخزون ${product.name} أثناء إنشاء الطلب، حاول مرة أخرى`}),{status:409,headers:{"content-type":"application/json"}});
        await tx.insert(orderItems).values({id:crypto.randomUUID(),orderId:id,productId:product.id,nameSnapshot:product.name,unitPrice:product.price,quantity:item.quantity,lineTotal:product.price*item.quantity});
        await tx.insert(inventoryMovements).values({id:crypto.randomUUID(),productId:product.id,type:"sale",quantity:-item.quantity,referenceType:"order",referenceId:id,actorId:user.id,note:"حجز مخزون للطلب",createdAt:now});
      }
      await tx.insert(orderStatusHistory).values({id:crypto.randomUUID(),orderId:id,fromStatus:null,toStatus:"pending",changedBy:user.id,note:"تم إنشاء الطلب",createdAt:now});
      if(couponId)await tx.insert(couponRedemptions).values({id:crypto.randomUUID(),couponId,userId:user.id,orderId:id,discountAmount:discount,createdAt:now});
    });
    const [merchant]=await db.select({ownerId:stores.ownerId}).from(stores).where(eq(stores.id,body.storeId)).limit(1);
    if(merchant)await createNotification({userId:merchant.ownerId,type:"order_new",title:"طلب جديد",body:`طلب ${number} بقيمة ${total.toFixed(2)} ج`,entityType:"order",entityId:id});
    return Response.json({order:{id,orderNumber:number,status:"pending",subtotal,discount,deliveryFee,total}},{status:201});
  }catch(e){if(e instanceof Response)return e;return Response.json({error:"تعذر إنشاء الطلب بأمان"},{status:500})}
}
