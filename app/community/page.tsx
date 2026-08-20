/* eslint-disable @next/next/no-html-link-for-pages */
import { CommunityFeed } from "./community-feed";
export const dynamic="force-dynamic";
export default function CommunityPage(){return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>المجتمع</small></span></a><a className="ghost" href="/ask">اسأل درب</a></header><section><span className="kicker">مجتمع محلي حقيقي</span><h1>درب الناس</h1><p>شارك خبرًا أو سؤالًا محليًا، وتظهر المشاركات من قاعدة البيانات مباشرة.</p><CommunityFeed/></section></main>}
