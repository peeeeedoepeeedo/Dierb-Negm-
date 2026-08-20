import Link from "next/link";
import { SpecializedListingsBoard } from "../listings/specialized-board";
export const metadata={title:"سيارات ديرب | ديرب أونلاين",description:"بيع وشراء السيارات داخل ديرب نجم وقراها."};
export default function CarsPage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>السيارات</small></span></Link><nav><Link href="/real-estate">العقارات</Link><Link href="/jobs">الوظائف</Link><Link href="/listings">كل الإعلانات</Link></nav></header><SpecializedListingsBoard kind="car"/></main>}
