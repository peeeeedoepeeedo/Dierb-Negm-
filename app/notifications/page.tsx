/* eslint-disable @next/next/no-html-link-for-pages */
import { requireChatGPTUser } from "../chatgpt-auth";
import { NotificationsCenter } from "./notifications-center";
export const dynamic="force-dynamic";
export default async function NotificationsPage(){await requireChatGPTUser("/notifications");return <main className="market-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الإشعارات</small></span></a><a className="ghost" href="/messages">الرسائل</a></header><section><span className="kicker">تنبيهات حسابك</span><h1>مركز الإشعارات</h1><NotificationsCenter/></section></main>}
