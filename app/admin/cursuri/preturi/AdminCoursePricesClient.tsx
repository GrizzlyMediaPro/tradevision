"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  resetCoursePrice,
  saveCoursePrice,
} from "@/app/admin/actions/coursePrices";
import {
  formatCoursePrice,
  type CoursePriceRow,
} from "@/lib/courseProductPricing";

type AdminCoursePricesClientProps = {
  initialCourses: CoursePriceRow[];
};

export function AdminCoursePricesClient({
  initialCourses,
}: AdminCoursePricesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      initialCourses.map((course) => [course.slug, String(course.priceAmount)]),
    ),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = (slug: string) => {
    const raw = drafts[slug]?.trim().replace(",", ".");
    const priceAmount = Number(raw);

    startTransition(async () => {
      try {
        setError(null);
        setSuccess(null);
        await saveCoursePrice({ slug, priceAmount });
        setSuccess("Prețul a fost actualizat.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Eroare la salvare.");
      }
    });
  };

  const handleReset = (slug: string, defaultPrice: number) => {
    if (
      !confirm(
        "Resetezi prețul la valoarea implicită din catalog? Modificările salvate vor fi șterse.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        setSuccess(null);
        await resetCoursePrice(slug);
        setDrafts((current) => ({
          ...current,
          [slug]: String(defaultPrice),
        }));
        setSuccess("Prețul a fost resetat la valoarea implicită.");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Eroare la resetare.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-white/60">
        Prețurile se aplică imediat pe paginile de achiziție și în calculele de
        discount pentru comenzile noi. Comenzile deja create păstrează prețul de
        la momentul înscrierii.
      </p>

      <div className="space-y-4">
        {initialCourses.map((course) => {
          const isCustomPrice = course.updatedAt !== null;
          return (
            <div
              key={course.slug}
              className="rounded-2xl border border-white/10 bg-white/3 p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    {course.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">{course.subtitle}</p>
                  <p className="mt-3 text-xs text-white/40">
                    Slug: <span className="text-white/60">{course.slug}</span>
                    {course.adminPath ? (
                      <>
                        {" "}
                        · Pagină:{" "}
                        <Link
                          href={course.adminPath}
                          className="text-yellow-300 hover:underline"
                          target="_blank"
                        >
                          {course.adminPath}
                        </Link>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-2 text-xs text-white/45">
                    Preț implicit catalog:{" "}
                    {formatCoursePrice(
                      course.defaultPriceAmount,
                      course.priceCurrency,
                    )}
                    {isCustomPrice && course.updatedAt
                      ? ` · Ultima modificare: ${new Date(course.updatedAt).toLocaleString("ro-RO")}`
                      : " · Folosești prețul implicit"}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-[280px]">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wider text-white/50">
                      Preț ({course.priceCurrency})
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={drafts[course.slug] ?? ""}
                      onChange={(e) =>
                        setDrafts((current) => ({
                          ...current,
                          [course.slug]: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSave(course.slug)}
                      disabled={isPending}
                      className="rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-50"
                    >
                      {isPending ? "Se salvează..." : "Salvează"}
                    </button>
                    {isCustomPrice ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleReset(course.slug, course.defaultPriceAmount)
                        }
                        disabled={isPending}
                        className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/70 disabled:opacity-50"
                      >
                        Resetează
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
    </div>
  );
}

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-300/40";
