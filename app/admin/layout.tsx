import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const publicMetadata = (user.publicMetadata ?? {}) as any;
  const privateMetadata = (user.privateMetadata ?? {}) as any;
  const isAdmin =
    publicMetadata.isAdmin === true || privateMetadata.isAdmin === true;

  if (!isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
