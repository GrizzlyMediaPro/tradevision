"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/adminAuth";

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
