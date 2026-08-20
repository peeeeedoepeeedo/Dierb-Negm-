/* eslint-disable @next/next/no-html-link-for-pages */
import { requireChatGPTUser } from "../chatgpt-auth";
import { MessagesApp } from "./messages-app";
export const dynamic="force-dynamic";
export default async function MessagesPage(){await requireChatGPTUser("/messages");return <main className="inbox-page"><header><a className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب</strong><small>الرسائل</small></span></a><div><a className="ghost" href="/notifications">الإشعارات</a><a className="ghost" href="/">الرئيسية</a></div></header><MessagesApp/></main>}
