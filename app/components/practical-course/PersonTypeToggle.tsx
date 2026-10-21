"use client";

import type { PersonType } from "@/lib/practicalCourseValidation";
import { useT } from "@/lib/i18n/I18nProvider";

type PersonTypeToggleProps = {
  value: PersonType;
  onChange: (value: PersonType) => void;
};

export function PersonTypeToggle({ value, onChange }: PersonTypeToggleProps) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-3">
      {(
        [
          { id: "PF" as const, label: t("course.person.pf") },
          { id: "PJ" as const, label: t("course.person.pj") },
        ] as const
      ).map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              active
                ? "border-yellow-300/60 bg-yellow-400/10 text-yellow-200"
                : "border-white/10 bg-white/3 text-white/70 hover:border-white/20"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
