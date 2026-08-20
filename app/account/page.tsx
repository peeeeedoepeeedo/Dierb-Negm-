import Link from "next/link";
import { requireChatGPTUser } from "../chatgpt-auth";
import { AccountSettings } from "./settings";

export default async function AccountPage() {
  await requireChatGPTUser("/account");
  return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><strong>حسابي</strong></Link><Link className="ghost" href="/">الرئيسية</Link></header><AccountSettings /></main>;
}
