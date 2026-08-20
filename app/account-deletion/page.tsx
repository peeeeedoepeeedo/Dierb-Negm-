import Link from "next/link";

export const metadata = { title: "حذف الحساب | ديرب أونلاين" };

export default function AccountDeletionPage() {
  return (
    <main className="market-page" dir="rtl">
      <header>
        <Link className="brand" href="/"><span className="brand-mark">د</span><strong>حذف الحساب</strong></Link>
        <Link className="ghost" href="/account">حسابي</Link>
      </header>
      <section className="card" style={{maxWidth: 900, margin: "24px auto", lineHeight: 1.9}}>
        <h1>طلب حذف حساب ديرب أونلاين</h1>
        <p>يمكن للمستخدم المسجل حذف حسابه من داخل التطبيق أو الموقع عبر: <strong>حسابي ← إعدادات الحساب ← حذف الحساب</strong>.</p>
        <h2>ماذا يحدث عند الحذف؟</h2>
        <p>يتم تعطيل هوية الحساب وإلغاء جميع الجلسات النشطة ومنع تسجيل الدخول بالحساب المحذوف. يتم تقليل أو فصل البيانات الشخصية غير الضرورية قدر الإمكان.</p>
        <h2>البيانات التي قد نحتاج للاحتفاظ بها</h2>
        <p>قد نحتفظ بالحد الأدنى من سجلات الطلبات والمعاملات وسجلات التدقيق والبلاغات عندما تكون لازمة لأغراض محاسبية أو أمنية أو لمنع الاحتيال وحماية أطراف التعامل. لا يُستخدم هذا الاحتفاظ لإعادة تنشيط الحساب دون إجراء جديد من المستخدم.</p>
        <h2>إذا تعذر الدخول للحساب</h2>
        <p>افتح <Link href="/support">مركز الدعم</Link> وقدم طلب حذف الحساب مع المعلومات الكافية للتحقق من ملكيته. لا ترسل كلمة المرور في تذكرة الدعم.</p>
        <p><strong>آخر تحديث:</strong> 20 أغسطس 2026.</p>
      </section>
    </main>
  );
}
