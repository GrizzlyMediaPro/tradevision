"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import type { PayoutTrackerData } from "@/lib/payoutTracker/types";
import { isValidTrackerData } from "@/lib/payoutTracker/validation";

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  imageUrl: string;
  isAdmin: boolean;
  banned: boolean;
  createdAt: number;
  lastSignInAt: number | null;
  lastActiveAt: number | null;
};

export type AdminUserPayoutSnapshot = {
  date: string;
  updatedAt: string;
  data: PayoutTrackerData;
};

export type AdminUserPayoutTracker = {
  user: Pick<
    AdminUser,
    "id" | "firstName" | "lastName" | "email" | "imageUrl"
  >;
  snapshots: AdminUserPayoutSnapshot[];
};

export async function getUsers(): Promise<AdminUser[]> {
  await requireAdmin();

  const client = await clerkClient();
  const users: AdminUser[] = [];
  const pageSize = 100;
  let offset = 0;

  // Clerk paginează la max 500/pagină; iterăm ca să îi aducem pe toți
  for (;;) {
    const { data } = await client.users.getUserList({
      limit: pageSize,
      offset,
      orderBy: "-created_at",
    });

    for (const user of data) {
      const primaryEmail = user.emailAddresses.find(
        (address) => address.id === user.primaryEmailAddressId
      );
      const pub = (user.publicMetadata ?? {}) as Record<string, unknown>;
      const priv = (user.privateMetadata ?? {}) as Record<string, unknown>;

      users.push({
        id: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: primaryEmail?.emailAddress ?? "",
        emailVerified: primaryEmail?.verification?.status === "verified",
        imageUrl: user.imageUrl,
        isAdmin: pub.isAdmin === true || priv.isAdmin === true,
        banned: user.banned,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        lastActiveAt: user.lastActiveAt,
      });
    }

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return users;
}

export async function getUserPayoutTracker(
  clerkUserId: string,
): Promise<AdminUserPayoutTracker> {
  await requireAdmin();

  if (!clerkUserId || typeof clerkUserId !== "string") {
    throw new Error("ID utilizator invalid.");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  const primaryEmail = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId,
  );

  const rows = await prisma.payoutTrackerSnapshot.findMany({
    where: { clerkUserId },
    orderBy: { snapshotDate: "desc" },
    select: { snapshotDate: true, updatedAt: true, data: true },
  });

  const snapshots: AdminUserPayoutSnapshot[] = [];
  for (const row of rows) {
    if (!isValidTrackerData(row.data)) continue;
    snapshots.push({
      date: row.snapshotDate,
      updatedAt: row.updatedAt.toISOString(),
      data: row.data,
    });
  }

  return {
    user: {
      id: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: primaryEmail?.emailAddress ?? "",
      imageUrl: user.imageUrl,
    },
    snapshots,
  };
}
