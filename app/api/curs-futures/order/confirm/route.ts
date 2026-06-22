import { NextResponse } from "next/server";
import {
  assertOrderAccess,
  getOrderCookieOrderId,
} from "@/lib/practicalCourseOrder";
import { confirmPracticalCoursePayment } from "@/lib/practicalCoursePayment";

export async function POST() {
  try {
    const orderId = await getOrderCookieOrderId();
    if (!orderId || !(await assertOrderAccess(orderId))) {
      return NextResponse.json({ error: "Acces neautorizat." }, { status: 403 });
    }

    const result = await confirmPracticalCoursePayment(orderId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Eroare la confirmarea plății curs futures", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Nu am putut finaliza confirmarea plății.",
      },
      { status: 500 },
    );
  }
}
