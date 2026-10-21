import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  getOrderCookieOrderId,
} from "@/lib/practicalCourseOrder";
import {
  confirmPracticalCoursePayment,
  confirmPracticalCoursePaymentBySession,
} from "@/lib/practicalCoursePayment";
import { getT } from "@/lib/i18n/get-t";

type ConfirmBody = {
  sessionId?: string;
};

export async function POST(req: Request) {
  const t = await getT();
  try {
    const body = (await req.json().catch(() => ({}))) as ConfirmBody;
    const sessionId = body.sessionId?.trim();

    if (sessionId) {
      const result = await confirmPracticalCoursePaymentBySession(sessionId);
      return NextResponse.json(result);
    }

    const orderId = await getOrderCookieOrderId();
    if (!orderId || !(await assertOrderAccess(orderId))) {
      return NextResponse.json({ error: t("course.api.unauthorized") }, { status: 403 });
    }

    const result = await confirmPracticalCoursePayment(orderId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Eroare la confirmarea plății curs futures", err);
    return NextResponse.json(
      { error: t("course.api.confirmFailed") },
      { status: 500 },
    );
  }
}
