import Link from "next/link";
import { LoginForm } from "../login/login-form";

export const metadata = { title: "إنشاء حساب | ديرب أونلاين", description: "أنشئ حسابك الآمن على ديرب أونلاين." };

export default function RegisterPage(){return <main className="market-page"><header><Link className="brand" href="/"><span className="brand-mark">د</span><span><strong>ديرب أونلاين</strong><small>حساب جديد</small></span></Link><Link className="ghost" href="/login">تسجيل الدخول</Link></header><section className="auth-shell"><span className="kicker">انضم إلى أهل ديرب</span><h1>إنشاء حساب جديد</h1><LoginForm initialMode="register"/></section></main>}
