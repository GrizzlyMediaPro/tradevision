import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Creează cont",
  description:
    "Creează-ți un cont TradeVision România și primești acces la Payout Tracker și instrumentele pentru traderi.",
};

export default function SignUpPage() {
  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-16 pb-20">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Creează-ți contul
          </h1>
          <div className="mt-3 h-[2px] w-[80px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-xs md:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Durează sub un minut. Primești acces la Payout Tracker și la
            instrumentele TradeVision.
          </p>
        </div>

        <SignUp appearance={clerkAppearance} />
      </div>
    </main>
  );
}
