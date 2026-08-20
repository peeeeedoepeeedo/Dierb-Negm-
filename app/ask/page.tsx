/* eslint-disable @next/next/no-html-link-for-pages */
import { AskBoard } from "./ask-board";
export const dynamic="force-dynamic";
export default function AskPage(){return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>اسأل</small></span></a><a className="ghost" href="/community">المجتمع</a></header><section><span className="kicker">خبرة الناس لبعض</span><h1>اسأل درب</h1><p>أسئلة وإجابات حقيقية من أهل المركز.</p><AskBoard/></section></main>}
