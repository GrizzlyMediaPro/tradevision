"use client";

import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useT } from "@/lib/i18n/I18nProvider";

const MONTH_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const WEEKDAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-300/40";

type ExpiresAtPickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
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

function parseDateTime(value: string | null): {
  date: string | null;
  hour: number;
  minute: number;
} {
  if (!value) return { date: null, hour: 23, minute: 59 };
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return { date: null, hour: 23, minute: 59 };
  const [hourRaw, minuteRaw] = timePart.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  return {
    date: parseIsoDate(datePart) ? datePart : null,
    hour: Number.isFinite(hour) ? Math.min(23, Math.max(0, hour)) : 23,
    minute: Number.isFinite(minute) ? Math.min(59, Math.max(0, minute)) : 59,
  };
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function combineDateTime(
  date: string | null,
  hour: number,
  minute: number,
): string | null {
  if (!date) return null;
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function toLocalDatetimeValue(date: Date): string {
  return combineDateTime(
    toIsoDate(date.getFullYear(), date.getMonth(), date.getDate()),
    date.getHours(),
    date.getMinutes(),
  )!;
}

function formatDisplayDate(value: string): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year <= currentYear + 10; year += 1) {
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

function ScrollTimeColumn({
  label,
  values,
  selected,
  disabled = false,
  onSelect,
}: {
  label: string;
  values: number[];
  selected: number;
  disabled?: boolean;
  onSelect: (value: number) => void;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const item = container.querySelector<HTMLElement>(
      `[data-value="${selected}"]`,
    );
    item?.scrollIntoView({ block: "center" });
  }, [selected]);

  return (
    <div className="flex flex-col items-center">
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
        {label}
      </span>
      <div
        ref={listRef}
        className="h-36 w-14 overflow-y-auto rounded-xl border border-white/10 bg-black/30 scroll-smooth [scrollbar-width:thin]"
      >
        {values.map((value) => {
          const isSelected = value === selected;
          return (
            <button
              key={value}
              type="button"
              data-value={value}
              disabled={disabled}
              onClick={() => onSelect(value)}
              className={`flex h-9 w-full items-center justify-center text-sm transition ${
                isSelected
                  ? "bg-yellow-400/20 font-semibold text-yellow-200"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              } ${disabled ? "cursor-not-allowed" : ""}`}
            >
              {String(value).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExpiresAtPicker({
  value,
  onChange,
  label,
  className = "",
}: ExpiresAtPickerProps) {
  const t = useT();
  const resolvedLabel = label ?? t("admin.expires.label");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const parsed = parseDateTime(value);
  const selectedDate = parsed.date ? parseIsoDate(parsed.date) : null;
  const today = new Date();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );

  useEffect(() => {
    if (!calendarOpen) return;
    if (parsed.date) {
      const date = parseIsoDate(parsed.date);
      if (date) {
        setViewYear(date.getFullYear());
        setViewMonth(date.getMonth());
      }
    }
  }, [calendarOpen, parsed.date]);

  useEffect(() => {
    if (!calendarOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCalendarOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [calendarOpen]);

  const days = buildCalendarDays(viewYear, viewMonth);
  const years = getYearOptions();

  const updateTime = (hour: number, minute: number) => {
    if (!parsed.date) return;
    onChange(combineDateTime(parsed.date, hour, minute));
  };

  const selectDay = (day: number) => {
    const date = toIsoDate(viewYear, viewMonth, day);
    onChange(combineDateTime(date, parsed.hour, parsed.minute));
    setCalendarOpen(false);
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
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
      return;
    }
    setViewMonth((m) => m + 1);
  };

  const displayDate = parsed.date ? formatDisplayDate(parsed.date) : "";
  const displayTime = parsed.date
    ? `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}`
    : "";

  return (
    <div ref={rootRef} className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-white/50">
        {resolvedLabel}
      </span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative min-w-[220px] flex-1">
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={calendarOpen}
            onClick={() => setCalendarOpen((prev) => !prev)}
            className={`flex w-full items-center justify-between gap-3 text-left ${inputClass} ${
              calendarOpen ? "border-yellow-300/40" : ""
            }`}
          >
            <span className={displayDate ? "text-white" : "text-white/35"}>
              {displayDate || t("admin.expires.placeholder")}
            </span>
            <FaCalendarAlt className="h-4 w-4 shrink-0 text-yellow-300/80" />
          </button>

          {calendarOpen ? (
            <div
              role="dialog"
              aria-label={t("admin.expires.calendar")}
              className="absolute left-0 top-full z-50 mt-2 w-full min-w-[280px] rounded-2xl border border-white/10 bg-[#0a0d1f] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            >
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/70 transition hover:border-white/25 hover:text-white"
                  aria-label={t("admin.expires.prevMonth")}
                >
                  <FaChevronLeft className="h-3 w-3" />
                </button>

                <div className="grid flex-1 grid-cols-2 gap-2">
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(Number(e.target.value))}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-white outline-none focus:border-yellow-300/50"
                    aria-label={t("admin.expires.month")}
                  >
                    {MONTH_IDS.map((monthId, index) => (
                      <option
                        key={monthId}
                        value={index}
                        className="bg-[#0a0d1f]"
                      >
                        {t(`admin.month.${monthId}`)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(Number(e.target.value))}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-xs text-white outline-none focus:border-yellow-300/50"
                    aria-label={t("admin.expires.year")}
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
                  aria-label={t("admin.expires.nextMonth")}
                >
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1">
                {WEEKDAY_IDS.map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white/40"
                  >
                    {t(`admin.weekday.${day}`)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="h-9" />;
                  }

                  const isSelected =
                    selectedDate &&
                    selectedDate.getFullYear() === viewYear &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getDate() === day;
                  const isToday =
                    today.getFullYear() === viewYear &&
                    today.getMonth() === viewMonth &&
                    today.getDate() === day;

                  return (
                    <button
                      key={`${viewYear}-${viewMonth}-${day}`}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={`flex h-9 items-center justify-center rounded-lg text-sm transition ${
                        isSelected
                          ? "bg-yellow-400 font-semibold text-slate-900"
                          : isToday
                            ? "border border-yellow-300/40 text-yellow-200"
                            : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={`flex items-end gap-3 rounded-2xl border border-white/10 bg-white/3 p-3 ${
            parsed.date ? "" : "opacity-50"
          }`}
        >
          <ScrollTimeColumn
            label={t("admin.expires.hours")}
            values={HOURS}
            selected={parsed.hour}
            disabled={!parsed.date}
            onSelect={(hour) => updateTime(hour, parsed.minute)}
          />
          <span className="pb-12 text-lg font-semibold text-white/30">:</span>
          <ScrollTimeColumn
            label={t("admin.expires.minutes")}
            values={MINUTES}
            selected={parsed.minute}
            disabled={!parsed.date}
            onSelect={(minute) => updateTime(parsed.hour, minute)}
          />
        </div>

        {parsed.date ? (
          <div className="flex flex-col justify-end gap-2">
            <p className="text-xs text-white/45">
              {t("admin.expires.prefix")}{" "}
              <span className="text-white/75">
                {t("admin.expires.when", {
                  date: displayDate,
                  time: displayTime,
                })}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
            >
              <FaTimes className="h-3 w-3" />
              {t("admin.expires.clear")}
            </button>
          </div>
        ) : (
          <p className="max-w-[180px] self-center text-xs leading-relaxed text-white/40">
            {t("admin.expires.hint")}
          </p>
        )}
      </div>
    </div>
  );
}
