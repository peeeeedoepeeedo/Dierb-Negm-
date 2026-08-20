import Link from "next/link";
import { requireChatGPTUser } from "../chatgpt-auth";
import { SupportCenter } from "./support-center";
export default async function SupportPage(){await requireChatGPTUser("/support");return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><strong>الدعم</strong></Link><Link className="ghost" href="/account">حسابي</Link></header><SupportCenter/></main>}
