import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { authSessions, profiles } from "../../../db/pg-schema";
import { requireApiUser } from "../../lib/authz";

export async function GET() {
  try {
    const user = await requireApiUser();
    return Response.json({
      profile: { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone, avatarKey: user.avatarKey },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "تعذر تحميل الحساب" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json() as { fullName?: string; phone?: string };
    const fullName = body.fullName?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    if (fullName.length < 2 || fullName.length > 100) return Response.json({ error: "الاسم غير صالح" }, { status: 400 });
    if (phone && !/^01\d{9}$/.test(phone)) return Response.json({ error: "رقم الهاتف غير صالح" }, { status: 400 });
    const [profile] = await getDb().update(profiles).set({ fullName, phone: phone || null, updatedAt: new Date() }).where(eq(profiles.id, user.id)).returning();
    return Response.json({ profile });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "تعذر حفظ الحساب" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await requireApiUser();
    const db = getDb();
    await db.batch([
      db.update(profiles).set({ status: "deleted", fullName: "حساب محذوف", phone: null, avatarKey: null, updatedAt: new Date() }).where(eq(profiles.id, user.id)),
      db.update(authSessions).set({ revokedAt: new Date() }).where(eq(authSessions.userId, user.id)),
    ]);
    return Response.json({ ok: true }, { headers: { "set-cookie": "derb_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" } });
  } catch (error) {
    if (error instanceof Response) return error;
    return Response.json({ error: "تعذر حذف الحساب" }, { status: 500 });
  }
}
