import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Autentificare",
  description:
    "Conectează-te la contul tău TradeVision România pentru a accesa Payout Tracker-ul și restul instrumentelor.",
};

export default function SignInPage() {
  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-16 pb-20">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Bine ai revenit
          </h1>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-xs md:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Conectează-te ca să îți accesezi Payout Tracker-ul și instrumentele
            TradeVision.
          </p>
        </div>

        <SignIn appearance={clerkAppearance} />
      </div>
    </main>
  );
}
