"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getT } from "@/lib/i18n/get-t";
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

export type AdminUserWithStats = AdminUser & {
  snapshotCount: number;
  lastSnapshotDate: string | null;
  investitii: number;
  payouts: number;
  profit: number;
  accounts: number;
};

export type AdminUsersOverviewStats = {
  withTracker: number;
  investitii: number;
  payouts: number;
  profit: number;
};

export type AdminUsersOverview = {
  users: AdminUserWithStats[];
  stats: AdminUsersOverviewStats;
};

function snapshotTotals(data: PayoutTrackerData) {
  let investitii = 0;
  let payouts = 0;
  let accounts = 0;
  for (const firm of data.firms) {
    investitii += Number(firm.investitii) || 0;
    payouts += Number(firm.payouts) || 0;
    accounts += firm.accounts.length;
  }
  return { investitii, payouts, profit: payouts - investitii, accounts };
}

/** Agregă pe ultimele snapshot-uri din fiecare lună (ca pe pagina de detaliu). */
function lifetimeTotalsFromSnapshots(
  snapshots: { date: string; data: PayoutTrackerData }[],
) {
  const latestPerMonth = new Map<
    string,
    { date: string; data: PayoutTrackerData }
  >();
  for (const item of snapshots) {
    const key = item.date.slice(0, 7);
    const current = latestPerMonth.get(key);
    if (!current || item.date > current.date) {
      latestPerMonth.set(key, item);
    }
  }

  const totals = { investitii: 0, payouts: 0, profit: 0, accounts: 0 };
  for (const item of latestPerMonth.values()) {
    const t = snapshotTotals(item.data);
    totals.investitii += t.investitii;
    totals.payouts += t.payouts;
    totals.profit += t.profit;
    totals.accounts += t.accounts;
  }
  return totals;
}

async function fetchClerkUsers(): Promise<AdminUser[]> {
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
        (address) => address.id === user.primaryEmailAddressId,
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

export async function getUsers(): Promise<AdminUser[]> {
  await requireAdmin();
  return fetchClerkUsers();
}

export async function getUsersOverview(): Promise<AdminUsersOverview> {
  await requireAdmin();

  const [users, rows] = await Promise.all([
    fetchClerkUsers(),
    prisma.payoutTrackerSnapshot.findMany({
      select: { clerkUserId: true, snapshotDate: true, data: true },
      orderBy: { snapshotDate: "desc" },
    }),
  ]);

  const snapshotsByUser = new Map<
    string,
    { date: string; data: PayoutTrackerData }[]
  >();

  for (const row of rows) {
    if (!isValidTrackerData(row.data)) continue;
    const list = snapshotsByUser.get(row.clerkUserId) ?? [];
    list.push({ date: row.snapshotDate, data: row.data });
    snapshotsByUser.set(row.clerkUserId, list);
  }

  const usersWithStats: AdminUserWithStats[] = users.map((user) => {
    const snapshots = snapshotsByUser.get(user.id) ?? [];
    const totals = lifetimeTotalsFromSnapshots(snapshots);
    return {
      ...user,
      snapshotCount: snapshots.length,
      lastSnapshotDate: snapshots[0]?.date ?? null,
      investitii: totals.investitii,
      payouts: totals.payouts,
      profit: totals.profit,
      accounts: totals.accounts,
    };
  });

  const stats: AdminUsersOverviewStats = {
    withTracker: 0,
    investitii: 0,
    payouts: 0,
    profit: 0,
  };

  for (const user of usersWithStats) {
    if (user.snapshotCount > 0) {
      stats.withTracker += 1;
      stats.investitii += user.investitii;
      stats.payouts += user.payouts;
      stats.profit += user.profit;
    }
  }

  return { users: usersWithStats, stats };
}

export async function getUserPayoutTracker(
  clerkUserId: string,
): Promise<AdminUserPayoutTracker> {
  await requireAdmin();

  if (!clerkUserId || typeof clerkUserId !== "string") {
    const t = await getT();
    throw new Error(t("admin.users.error.invalidId"));
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
