import { and, desc, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "../db";
import { listings, products, serviceProfiles, stores, systemSettings } from "../db/pg-schema";

async function loadHome() {
  try {
    const db = getDb();
    const [storeRows, productRows, serviceRows, listingRows, settings] = await Promise.all([
      db.select({ id: stores.id, name: stores.name, description: stores.description, address: stores.address }).from(stores).where(and(eq(stores.status, "active"), isNull(stores.deletedAt))).orderBy(desc(stores.updatedAt)).limit(8),
      db.select({ id: products.id, name: products.name, price: products.price, stock: products.stock }).from(products).where(and(eq(products.active, true), isNull(products.deletedAt))).orderBy(desc(products.updatedAt)).limit(8),
      db.select({ id: serviceProfiles.id, name: serviceProfiles.name, profession: serviceProfiles.profession }).from(serviceProfiles).where(and(eq(serviceProfiles.status, "active"), isNull(serviceProfiles.deletedAt))).orderBy(desc(serviceProfiles.updatedAt)).limit(6),
      db.select({ id: listings.id, title: listings.title, kind: listings.kind, price: listings.price }).from(listings).where(and(eq(listings.status, "active"), isNull(listings.deletedAt))).orderBy(desc(listings.updatedAt)).limit(8),
      db.select({ key: systemSettings.key, value: systemSettings.value }).from(systemSettings),
    ]);
    return { storeRows, productRows, serviceRows, listingRows, settings: Object.fromEntries(settings.map((item) => [item.key, item.value])) };
  } catch {
    return { storeRows: [], productRows: [], serviceRows: [], listingRows: [], settings: {} };
  }
}

const sections = [
  { href: "/market", icon: "س", title: "السوق", small: "منتجات ومتاجر" },
  { href: "/services", icon: "خ", title: "الخدمات", small: "خدمة موثوقة" },
  { href: "/directory", icon: "د", title: "دليل ديرب", small: "كل الأنشطة" },
  { href: "/community", icon: "م", title: "المجتمع", small: "أهل البلد" },
  { href: "/cars", icon: "ع", title: "السيارات", small: "بيع وشراء" },
  { href: "/real-estate", icon: "ب", title: "العقارات", small: "بيع وإيجار" },
  { href: "/jobs", icon: "و", title: "الوظائف", small: "فرص محلية" },
  { href: "/ask", icon: "؟", title: "اسأل ديرب", small: "إجابة سريعة" },
];

const routeForKind = (kind: string) => kind === "car" ? "/cars" : kind === "property" ? "/real-estate" : kind === "job" ? "/jobs" : "/listings";
const listingIcon = (kind: string) => kind === "car" ? "ع" : kind === "property" ? "ب" : kind === "job" ? "و" : "إ";

export default async function Home() {
  const data = await loadHome();
  const trialDays = Number(data.settings.merchant_trial_days || 30);
  const subscriptionPrice = Number(data.settings.merchant_monthly_price_egp || 149);
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand brand-pro" href="/" aria-label="ديرب أونلاين"><span className="brand-mark">د</span><span><strong>ديرب أونلاين</strong><small>كل بلدك في تطبيق واحد</small></span></Link>
        <nav className="desktop-nav"><Link href="/market">السوق</Link><Link href="/services">الخدمات</Link><Link href="/directory">الدليل</Link><Link href="/community">المجتمع</Link></nav>
        <div className="header-actions"><Link className="login-link" href="/login">تسجيل الدخول</Link><Link className="primary" href="/business">أضف نشاطك</Link></div>
      </header>

      <section className="premium-hero">
        <div className="hero-content">
          <span className="location-pill"><i /> ديرب نجم والقرى التابعة</span>
          <h1>ديرب كلها<br /><em>بين إيديك</em></h1>
          <p>اكتشف أفضل المتاجر والخدمات والعروض القريبة منك، واطلب كل احتياجاتك بسهولة من مكان واحد.</p>
          <form className="pro-search" action="/search"><span>⌕</span><input name="q" minLength={2} placeholder="بتدور على إيه في ديرب؟" aria-label="البحث في ديرب" /><button>ابحث</button></form>
          <div className="hero-actions"><Link className="download-cta" href="/register">ابدأ الآن مجانًا</Link><Link className="watch-link" href="/market"><span>←</span> تصفح السوق</Link></div>
          <div className="trust-row"><span>✓ أنشطة موثقة</span><span>✓ بيانات محلية</span><span>✓ دعم أهل ديرب</span></div>
        </div>
        <div className="app-showcase" aria-label="معاينة التطبيق">
          <div className="showcase-glow" />
          <div className="device">
            <div className="device-status"><span>9:41</span><b>● ● ●</b></div>
            <div className="device-head"><span><b>أهلًا بك</b><small>اختار اللي محتاجه النهارده</small></span><i>د</i></div>
            <div className="device-search">⌕ ابحث قريب منك</div>
            <div className="device-banner"><small>عروض ديرب</small><b>خصومات حصرية<br />من متاجر بلدك</b><span>شوف العروض ←</span></div>
            <div className="device-categories"><span><i>س</i><small>السوق</small></span><span><i>خ</i><small>خدمات</small></span><span><i>د</i><small>الدليل</small></span><span><i>م</i><small>مجتمع</small></span></div>
            <div className="device-section"><b>الأقرب ليك</b><small>عرض الكل</small></div>
            <div className="device-card"><i>د</i><span><b>متجر من ديرب</b><small>مفتوح الآن · قريب منك</small></span><strong>★ 4.9</strong></div>
          </div>
          <div className="floating-card card-a"><b>{data.storeRows.length || "—"}</b><span>متجر نشط</span></div>
          <div className="floating-card card-b"><span className="pulse" /><b>خدمة محلية</b><small>متاحة الآن</small></div>
        </div>
      </section>

      <section className="quick-panel">
        <div className="panel-title"><span>كل خدمات بلدك</span><h2>اختار وجهتك</h2></div>
        <div className="quick-grid">{sections.map((item) => <Link href={item.href} key={item.href} className="quick-card"><span className="quick-icon">{item.icon}</span><b>{item.title}</b><small>{item.small}</small><i>←</i></Link>)}</div>
      </section>

      <section className="numbers-strip"><div><strong>{data.storeRows.length}</strong><span>متجر ونشاط</span></div><div><strong>{data.productRows.length}</strong><span>منتج متاح</span></div><div><strong>{data.serviceRows.length}</strong><span>مقدم خدمة</span></div><div><strong>{data.listingRows.length}</strong><span>إعلان حديث</span></div></section>

      <section className="content-section">
        <div className="pro-heading"><div><span>مختارة ليك</span><h2>متاجر من ديرب</h2><p>اكتشف أنشطة قريبة منك وتواصل معها مباشرة.</p></div><Link href="/market">عرض كل المتاجر ←</Link></div>
        {data.storeRows.length === 0 ? <div className="premium-empty"><span>د</span><div><h3>المتاجر الجديدة هتظهر هنا</h3><p>بنجهز دليل الأنشطة المعتمدة في ديرب نجم.</p></div><Link href="/business">سجل نشاطك</Link></div> :
          <div className="premium-grid">{data.storeRows.map((store, index) => <article className="premium-card" key={store.id}><div className={"card-art art-" + (index % 4)}><span>د</span><small>موثّق</small></div><div><span className="card-type">متجر محلي</span><h3>{store.name}</h3><p>{store.description || store.address || "نشاط موثق على ديرب أونلاين"}</p><Link href="/market">عرض المنتجات <b>←</b></Link></div></article>)}</div>}
      </section>

      <section className="content-section tinted">
        <div className="pro-heading"><div><span>وصل حديثًا</span><h2>منتجات السوق</h2><p>منتجات من متاجر ديرب متاحة للطلب.</p></div><Link href="/market">كل المنتجات ←</Link></div>
        {data.productRows.length === 0 ? <div className="premium-empty"><span>س</span><div><h3>السوق بيتجهز</h3><p>هتظهر المنتجات بمجرد إضافتها من أصحاب المتاجر.</p></div><Link href="/market">دخول السوق</Link></div> :
          <div className="product-row">{data.productRows.map((product, index) => <article key={product.id}><div className={"product-visual pv-" + (index % 4)}><span>س</span></div><small>{product.stock > 0 ? "متاح الآن" : "غير متاح"}</small><h3>{product.name}</h3><strong>{product.price.toLocaleString("ar-EG")} جنيه</strong><Link href="/market">أضف للسلة</Link></article>)}</div>}
      </section>

      <section className="split-section">
        <div className="community-preview"><span className="mini-label">مجتمع ديرب</span><h2>خليك قريب من أهل بلدك</h2><p>اسأل، شارك، واعرف كل جديد في ديرب نجم والقرى.</p><div className="community-bubbles"><i>د</i><i>ن</i><i>ق</i><i>+</i></div><Link href="/community">ادخل المجتمع ←</Link></div>
        <div className="latest-panel"><div className="latest-title"><h3>أحدث الإعلانات</h3><Link href="/listings">عرض الكل</Link></div>{data.listingRows.length === 0 ? <p className="muted-copy">لا توجد إعلانات منشورة حتى الآن.</p> : data.listingRows.slice(0, 4).map((item) => <Link href={routeForKind(item.kind)} className="latest-item" key={item.id}><span>{listingIcon(item.kind)}</span><div><b>{item.title}</b><small>{item.price !== null ? item.price.toLocaleString("ar-EG") + " جنيه" : "تفاصيل الإعلان"}</small></div><i>←</i></Link>)}</div>
      </section>

      <section className="business-pro">
        <div><span className="business-badge">لأصحاب الأنشطة</span><h2>كبر شغلك مع ديرب أونلاين</h2><p>اعرض منتجاتك، استقبل الطلبات، وتابع نشاطك من لوحة تحكم احترافية.</p><div><Link href="/business">افتح متجرك الآن</Link><small>{trialDays} يوم مجانًا · ثم {subscriptionPrice} جنيه شهريًا</small></div></div>
        <div className="business-mock"><span className="chart-line" /><div><small>طلبات الشهر</small><b>+28%</b></div><div><small>عملاء جدد</small><b>+146</b></div></div>
      </section>

      <footer className="pro-footer"><div className="brand"><span className="brand-mark">د</span><span><strong>ديرب أونلاين</strong><small>منصة ديرب نجم المحلية</small></span></div><p>كل بلدك في تطبيق واحد.</p><nav><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link><Link href="/support">الدعم</Link><Link href="/account-deletion">حذف الحساب</Link></nav></footer>
      <nav className="mobile-nav" aria-label="تنقل التطبيق"><Link href="/"><b>⌂</b><small>الرئيسية</small></Link><Link href="/market"><b>س</b><small>السوق</small></Link><Link className="nav-search" href="/search"><b>⌕</b></Link><Link href="/community"><b>م</b><small>المجتمع</small></Link><Link href="/account"><b>ش</b><small>حسابي</small></Link></nav>
    </main>
  );
}
