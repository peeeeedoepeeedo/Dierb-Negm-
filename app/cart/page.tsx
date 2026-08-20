import { and, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { addresses, cartItems, carts, products, stores } from "../../db/pg-schema";
import { requireChatGPTUser } from "../chatgpt-auth";
import { requireApiUser } from "../lib/authz";
import { CartCheckout } from "./cart-checkout";
export const dynamic="force-dynamic";
export default async function CartPage(){await requireChatGPTUser("/cart");const user=await requireApiUser(),db=getDb();const items=await db.select({itemId:cartItems.id,cartId:carts.id,storeId:carts.storeId,storeName:stores.name,productId:products.id,name:products.name,price:products.price,stock:products.stock,quantity:cartItems.quantity}).from(carts).innerJoin(cartItems,eq(cartItems.cartId,carts.id)).innerJoin(products,eq(products.id,cartItems.productId)).innerJoin(stores,eq(stores.id,carts.storeId)).where(and(eq(carts.userId,user.id),eq(carts.status,"active")));const savedAddresses=await db.select().from(addresses).where(eq(addresses.userId,user.id));return <main className="market-page"><header><a className="brand" href="/market"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>إتمام الطلب</small></span></a></header><CartCheckout initialItems={items} initialAddresses={savedAddresses.map(a=>({...a,createdAt:a.createdAt.toISOString(),updatedAt:a.updatedAt.toISOString(),deletedAt:a.deletedAt?.toISOString()??null}))}/></main>}
