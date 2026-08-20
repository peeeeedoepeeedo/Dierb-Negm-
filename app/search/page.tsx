import Link from "next/link";
import { SearchExperience } from "./search-experience";
export default function SearchPage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><strong>البحث</strong></Link><Link className="ghost" href="/">الرئيسية</Link></header><SearchExperience/></main>}
