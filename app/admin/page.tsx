import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const publicMetadata = (user.publicMetadata ?? {}) as any;
  const isAdmin =
    publicMetadata.isAdmin === true || (user.privateMetadata as any)?.isAdmin === true;

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminPageClient />;
}
