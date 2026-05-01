import { prisma } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";
import Link from "next/link";

export const metadata = {
  title: "Dezabonare",
};

export default async function DezabonarePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim().toLowerCase();
  const token = params.token?.trim();

  let status: "success" | "invalid" | "error" = "invalid";

  if (email && token && verifyUnsubscribeToken(email, token)) {
    try {
      await prisma.newsletterSubscriber.deleteMany({
        where: { email },
      });
      status = "success";
    } catch (err) {
      console.error("Unsubscribe error:", err);
      status = "error";
    }
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md mx-auto p-10 rounded-2xl border border-white/10 bg-white/4">
        {status === "success" && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-xl font-semibold text-white mb-3">
              Te-ai dezabonat cu succes
            </h1>
            <p className="text-sm text-white/55 leading-relaxed">
              Nu vei mai primi emailuri de la Trade Vision. Dacă te
              răzgândești, te poți reabona oricând.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="text-4xl mb-4">✕</div>
            <h1 className="text-xl font-semibold text-white mb-3">
              Link invalid
            </h1>
            <p className="text-sm text-white/55 leading-relaxed">
              Linkul de dezabonare nu este valid sau a expirat.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl mb-4">!</div>
            <h1 className="text-xl font-semibold text-white mb-3">
              Eroare
            </h1>
            <p className="text-sm text-white/55 leading-relaxed">
              A apărut o eroare la dezabonare. Încearcă din nou mai târziu.
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Înapoi pe Trade Vision
        </Link>
      </div>
    </section>
  );
}
