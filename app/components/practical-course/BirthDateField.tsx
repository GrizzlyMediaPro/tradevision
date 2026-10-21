"use client";

import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useI18n, useT } from "@/lib/i18n/I18nProvider";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/50";

const FIELD_ID = "billing-bday";

type BirthDateFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplayDate(value: string, dateLocale: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  return date.toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= currentYear - 100; year -= 1) {
    years.push(year);
  }
  return years;
}

function buildCalendarDays(year: number, month: number): Array<number | null> {
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];

  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function isFutureDate(year: number, month: number, day: number): boolean {
  const candidate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return candidate > today;
}

export function BirthDateField({
  label,
  value,
  onChange,
  className = "",
}: BirthDateFieldProps) {
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const resolvedLabel = label ?? t("course.field.birthDate");
  const months = Array.from({ length: 12 }, (_, index) =>
    new Intl.DateTimeFormat(dateLocale, { month: "long" }).format(
      new Date(2024, index, 1),
    ),
  );
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(dateLocale, { weekday: "short" }).format(
      new Date(2024, 0, 1 + index),
    ),
  );
  const fieldId = FIELD_ID;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = parseIsoDate(value);
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? 1990);
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? 0);

  useEffect(() => {
    if (!open) return;
    const selectedDate = parseIsoDate(value);
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const days = buildCalendarDays(viewYear, viewMonth);
  const years = getYearOptions();

  const selectDay = (day: number) => {
    if (isFutureDate(viewYear, viewMonth, day)) return;
    onChange(toIsoDate(viewYear, viewMonth, day));
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
      return;
    }
    setViewMonth((m) => m - 1);
  };

  const goToNextMonth = () => {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    if (nextYear > today.getFullYear()) return;
    if (nextYear === today.getFullYear() && nextMonth > today.getMonth()) return;
    setViewMonth(nextMonth);
    setViewYear(nextYear);
  };

  const displayValue = formatDisplayDate(value, dateLocale);

  return (
    <div ref={rootRef} className={`relative flex flex-col gap-2 ${className}`}>
      <span
        id={`${fieldId}-label`}
        className="text-xs font-medium uppercase tracking-wider text-white/50"
      >
        {resolvedLabel}
      </span>

      <input type="hidden" name="bday" autoComplete="bday" value={value} readOnly />

      <button
        type="button"
        id={fieldId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${fieldId}-label`}
        onClick={() => setOpen((prev) => !prev)}
        className={`billing-autofill-input flex w-full items-center justify-between gap-3 text-left ${inputClass} ${
          open ? "border-yellow-300/50" : ""
        }`}
      >
        <span className={displayValue ? "text-white" : "text-white/30"}>
          {displayValue || t("course.field.birthDatePlaceholder")}
        </span>
        <FaCalendarAlt className="h-4 w-4 shrink-0 text-yellow-300/80" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={t("course.field.birthDateCalendar")}
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[280px] rounded-2xl border border-white/10 bg-[#0a0d1f] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        >
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white"
              aria-label={t("course.field.prevMonth")}
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>

            <div className="grid flex-1 grid-cols-2 gap-2">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-white outline-none focus:border-yellow-300/50"
                aria-label={t("course.field.month")}
              >
                {months.map((monthName, index) => (
                  <option key={monthName} value={index} className="bg-[#0a0d1f]">
                    {monthName}
                  </option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-white outline-none focus:border-yellow-300/50"
                aria-label={t("course.field.year")}
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-[#0a0d1f]">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white"
              aria-label={t("course.field.nextMonth")}
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekdays.map((day) => (
              <div
                key={day}
                className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white/40"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-9" />;
              }

              const isSelected =
                selected &&
                selected.getFullYear() === viewYear &&
                selected.getMonth() === viewMonth &&
                selected.getDate() === day;
              const disabled = isFutureDate(viewYear, viewMonth, day);
              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === day;

              return (
                <button
                  key={`${viewYear}-${viewMonth}-${day}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm transition ${
                    isSelected
                      ? "bg-yellow-400 font-semibold text-slate-900"
                      : isToday
                        ? "border border-yellow-300/40 text-yellow-200"
                        : "text-white/80 hover:bg-white/10"
                  } ${disabled ? "cursor-not-allowed opacity-30 hover:bg-transparent" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
