import Link from "next/link";
import { SpecializedListingsBoard } from "../listings/specialized-board";
export const metadata={title:"وظائف ديرب | ديرب أونلاين",description:"فرص العمل المحلية داخل ديرب نجم وقراها."};
export default function JobsPage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الوظائف</small></span></Link><nav><Link href="/cars">السيارات</Link><Link href="/real-estate">العقارات</Link><Link href="/listings">كل الإعلانات</Link></nav></header><SpecializedListingsBoard kind="job"/></main>}
