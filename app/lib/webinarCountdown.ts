import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { messages } from "@/lib/i18n/messages/catalog";
import { translate } from "@/lib/i18n/translate";

export function getDefaultWebinarCountdownTarget() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  return new Date(currentYear, currentMonth, currentDate + 7, 19, 0, 0).getTime();
}

export function getWebinarCountdownTarget(targetDate?: string | Date | null) {
  if (targetDate instanceof Date) {
    return targetDate.getTime();
  }

  if (typeof targetDate === "string" && targetDate.trim().length > 0) {
    const parsedTarget = new Date(targetDate);
    if (!Number.isNaN(parsedTarget.getTime())) {
      return parsedTarget.getTime();
    }
  }

  return getDefaultWebinarCountdownTarget();
}

export function formatWebinarLiveLabel(
  targetTimestamp: number,
  locale: Locale = DEFAULT_LOCALE,
) {
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
  const targetDate = new Date(targetTimestamp);
  const weekday = new Intl.DateTimeFormat(dateLocale, { weekday: "long" }).format(
    targetDate
  );
  const day = new Intl.DateTimeFormat(dateLocale, { day: "numeric" }).format(
    targetDate
  );
  const month = new Intl.DateTimeFormat(dateLocale, { month: "long" }).format(
    targetDate
  );
  const time = new Intl.DateTimeFormat(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(targetDate);

  const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const monthLabel = month.charAt(0).toUpperCase() + month.slice(1);

  return translate(messages[locale], "webinar.liveAt", {
    weekday: weekdayLabel,
    day,
    month: monthLabel,
    time,
  });
}

export function formatCountdownUnit(value: number) {
  return String(Math.max(value, 0)).padStart(2, "0");
}
