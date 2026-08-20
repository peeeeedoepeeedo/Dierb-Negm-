# Dierb Online — ديرب أونلاين

منصة محلية Full-Stack تضم واجهات العملاء والتجار والإدارة، وBackend داخل نفس المستودع. المتصفح لا يتصل بقاعدة البيانات أو التخزين مباشرة.

## Architecture

- UI: Next.js + React على Vercel، عربية RTL وResponsive.
- Backend: Route Handlers داخل `app/api` مع Validation وAuthorization على الخادم.
- Data access: Drizzle ORM عبر Node server runtime في `db/node.ts`، يقبل اتصال Neon/PostgreSQL pooled ويدعم المعاملات الحقيقية.
- Database: PostgreSQL، والمخطط في `db/pg-schema.ts` والترحيلات في `drizzle-pg/`.
- Authentication: حسابات محلية، PBKDF2-SHA256، جلسات Server-side، وHttpOnly/SameSite cookies. لا يعتمد Runtime على Supabase أو SIWC.
- Storage: S3-compatible adapter مع روابط خاصة موقعة وفحص MIME والحجم والامتداد والملكية. لا يمر أي مفتاح تخزين إلى Browser.

## Environment

انسخ `.env.example` إلى `.env.local` وأدخل القيم محليًا. لا ترفع الملف الحقيقي. يقبل `DATABASE_URL` اتصال PostgreSQL قياسيًا مثل `postgresql://user:pass@host:5432/database`.

## Development

```bash
npm ci
npm run typecheck
npm run db:generate
npm run dev
```

## Database

```bash
npm run db:generate
npm run db:migrate
```

لتشغيل PostgreSQL محليًا:

```bash
docker compose up -d database
DATABASE_URL=postgresql://dierb:dierb_dev_only@localhost:5432/dierb npm run db:migrate
DATABASE_URL=postgresql://dierb:dierb_dev_only@localhost:5432/dierb npm run test:integration
```

كل تعديل Schema يجب أن ينتج Migration جديدة. لا تعدّل قاعدة الإنتاج يدويًا. لا توجد Seed لبيانات أعمال وهمية؛ بيانات التطوير تُنشأ عبر التدفقات الحقيقية.

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Authentication and roles

الأدوار: Customer، Merchant، Service Provider، Delivery، Moderator، Admin، Super Admin. الصلاحيات وOwnership checks تتم داخل الـBackend، ولا يتم الوثوق بـ`user_id` أو `store_id` من المتصفح.

إنشاء أول Super Admin يجب أن يتم لاحقًا بأمر CLI أحادي الاستخدام يقرأ البريد من Environment ويُسجل Audit Log؛ لا توجد كلمة مرور أو هوية Admin ثابتة داخل المستودع.

## External providers

- Neon PostgreSQL عبر `DATABASE_URL` على الخادم فقط.
- مزود S3-compatible عند تفعيل رفع الملفات في الإنتاج.
- Email provider لإرسال Reset Password والتنبيهات البريدية.
- Payment provider عند التعاقد؛ لا يوجد Fake Payment.

إصدار الويب وAndroid يمران عبر GitHub Actions بعد نجاح بوابات الجودة، ولا تُحفظ أسرار الإنتاج أو مفاتيح التوقيع داخل Git.
