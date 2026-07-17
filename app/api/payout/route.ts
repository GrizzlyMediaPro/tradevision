import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import {
  isValidSnapshotDate,
  isValidTrackerData,
} from "@/lib/payoutTracker/validation";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const date = new URL(req.url).searchParams.get("date");
  if (!isValidSnapshotDate(date)) {
    return NextResponse.json({ error: "Data este invalidă." }, { status: 400 });
  }

  try {
    const exact = await prisma.payoutTrackerSnapshot.findUnique({
      where: {
        clerkUserId_snapshotDate: {
          clerkUserId: userId,
          snapshotDate: date,
        },
      },
      select: { data: true, updatedAt: true, snapshotDate: true },
    });

    if (exact) {
      return NextResponse.json({
        data: exact.data,
        updatedAt: exact.updatedAt.toISOString(),
        carriedFrom: null,
      });
    }

    // Fără salvare pe ziua cerută: preia ultima salvare anterioară
    // (ziua rămâne „ca ultima salvare” până la următorul Salvează).
    const previous = await prisma.payoutTrackerSnapshot.findFirst({
      where: {
        clerkUserId: userId,
        snapshotDate: { lt: date },
      },
      orderBy: { snapshotDate: "desc" },
      select: { data: true, updatedAt: true, snapshotDate: true },
    });

    return NextResponse.json({
      data: previous?.data ?? null,
      updatedAt: previous?.updatedAt.toISOString() ?? null,
      carriedFrom: previous?.snapshotDate ?? null,
    });
  } catch (error) {
    console.error("Eroare la citirea Payout Tracker", error);
    return NextResponse.json(
      { error: "Datele nu au putut fi încărcate." },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { success } = rateLimit(`payout-tracker:${userId}`, {
    maxRequests: 30,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Prea multe salvări. Încearcă din nou într-un minut." },
      { status: 429 },
    );
  }

  try {
    const body = (await req.json()) as { date?: unknown; data?: unknown };
    if (!isValidSnapshotDate(body.date) || !isValidTrackerData(body.data)) {
      return NextResponse.json(
        { error: "Datele trimise sunt invalide." },
        { status: 400 },
      );
    }

    const snapshot = await prisma.payoutTrackerSnapshot.upsert({
      where: {
        clerkUserId_snapshotDate: {
          clerkUserId: userId,
          snapshotDate: body.date,
        },
      },
      create: {
        clerkUserId: userId,
        snapshotDate: body.date,
        data: body.data as Prisma.InputJsonValue,
      },
      update: {
        data: body.data as Prisma.InputJsonValue,
      },
      select: { updatedAt: true },
    });

    return NextResponse.json({
      ok: true,
      updatedAt: snapshot.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Eroare la salvarea Payout Tracker", error);
    return NextResponse.json(
      { error: "Datele nu au putut fi salvate." },
      { status: 500 },
    );
  }
}
