import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  verifyWebinarConfirmToken,
  WEBINAR_CONFIRM_COOKIE_NAME,
} from "@/lib/webinarConfirmCookie";

const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/tracking(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/webinar/confirmare") {
    const raw = req.cookies.get(WEBINAR_CONFIRM_COOKIE_NAME)?.value;
    const ok = await verifyWebinarConfirmToken(raw);
    if (!ok) {
      return NextResponse.redirect(new URL("/webinar/formular", req.url));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
