import Link from "next/link";
import { DirectoryBoard } from "./directory-board";
export const metadata={title:"دليل ديرب | ديرب أونلاين",description:"دليل المتاجر والخدمات والمهنيين في مدينة وقرى مركز ديرب نجم."};
export default function DirectoryPage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الدليل المحلي</small></span></Link><nav><Link href="/market">السوق</Link><Link href="/services">الخدمات</Link><Link href="/ask">اسأل أهل ديرب</Link></nav></header><section className="directory-hero"><span className="kicker">44 قرية + مدينة ديرب نجم</span><h1>دليل ديرب نجم</h1><p>دور على محل أو خدمة أو مهني، وحدد القرية علشان توصل لأقرب نتيجة.</p></section><DirectoryBoard/></main>}
