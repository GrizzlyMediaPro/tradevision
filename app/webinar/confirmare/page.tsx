import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifyWebinarConfirmToken,
  WEBINAR_CONFIRM_COOKIE_NAME,
} from "@/lib/webinarConfirmCookie";
import { WebinarConfirmareShell } from "./WebinarConfirmareShell";

export default async function WebinarConfirmarePage() {
  const jar = await cookies();
  const raw = jar.get(WEBINAR_CONFIRM_COOKIE_NAME)?.value;
  const verified = await verifyWebinarConfirmToken(raw);
  if (!verified) {
    redirect("/webinar/formular");
  }
  return <WebinarConfirmareShell firstName={verified.firstName} />;
}
