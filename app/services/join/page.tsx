import { requireChatGPTUser } from "../../chatgpt-auth";
import { ServiceJoinForm } from "./service-join-form";
export const dynamic="force-dynamic";
export default async function Join(){await requireChatGPTUser("/services/join");return <main className="market-page"><section><span className="kicker">Derb Services</span><h1>سجّل خدمتك</h1><ServiceJoinForm/></section></main>}
