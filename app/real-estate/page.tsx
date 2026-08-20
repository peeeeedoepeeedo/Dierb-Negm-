import Link from "next/link";
import { SpecializedListingsBoard } from "../listings/specialized-board";
export const metadata={title:"عقارات ديرب | ديرب أونلاين",description:"بيع وإيجار العقارات داخل ديرب نجم وقراها."};
export default function RealEstatePage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>العقارات</small></span></Link><nav><Link href="/cars">السيارات</Link><Link href="/jobs">الوظائف</Link><Link href="/listings">كل الإعلانات</Link></nav></header><SpecializedListingsBoard kind="property"/></main>}
