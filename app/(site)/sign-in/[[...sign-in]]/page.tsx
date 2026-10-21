import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";
import { getT } from "@/lib/i18n/get-t";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("auth.signIn.metaTitle"),
    description: t("auth.signIn.metaDescription"),
  };
}

export default async function SignInPage() {
  const t = await getT();
  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-16 pb-20">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            {t("auth.signIn.heading")}
          </h1>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-xs md:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            {t("auth.signIn.body")}
          </p>
        </div>

        <SignIn appearance={clerkAppearance} />
      </div>
    </main>
  );
}
