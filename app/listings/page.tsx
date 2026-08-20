/* eslint-disable @next/next/no-html-link-for-pages */
import { ListingsBoard } from "./listings-board";
export const dynamic="force-dynamic";
export default function ListingsPage(){return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الإعلانات</small></span></a><a className="ghost" href="/market">المتاجر</a></header><section><span className="kicker">بيع وشراء وفرص</span><h1>سوق إعلانات ديرب</h1><p>إعلانات مبوبة وسيارات وعقارات ووظائف، وكل إعلان جديد يمر على مراجعة الإدارة.</p><ListingsBoard/></section></main>}
