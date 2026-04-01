import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: not logged in");
  }

  const pub = (user.publicMetadata ?? {}) as Record<string, unknown>;
  const priv = (user.privateMetadata ?? {}) as Record<string, unknown>;
  const isAdmin = pub.isAdmin === true || priv.isAdmin === true;

  if (!isAdmin) {
    throw new Error("Forbidden: not an admin");
  }

  return user;
}
