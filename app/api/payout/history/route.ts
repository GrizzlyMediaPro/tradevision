import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n/get-t";

export async function GET(req: Request) {
  const t = await getT();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: t("payout.api.unauthorized") }, { status: 401 });
  }

  const full = new URL(req.url).searchParams.get("full") === "1";

  try {
    const snapshots = await prisma.payoutTrackerSnapshot.findMany({
      where: { clerkUserId: userId },
      orderBy: { snapshotDate: "desc" },
      select: { snapshotDate: true, updatedAt: true, data: full },
    });

    return NextResponse.json({
      snapshots: snapshots.map((snapshot) => ({
        date: snapshot.snapshotDate,
        updatedAt: snapshot.updatedAt.toISOString(),
        ...(full ? { data: snapshot.data } : {}),
      })),
    });
  } catch (error) {
    console.error("Eroare la citirea istoricului Payout Tracker", error);
    return NextResponse.json(
      { error: t("payout.api.historyFailed") },
      { status: 500 },
    );
  }
}
