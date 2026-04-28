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

export function formatWebinarLiveLabel(targetTimestamp: number) {
  const targetDate = new Date(targetTimestamp);
  const weekday = new Intl.DateTimeFormat("ro-RO", { weekday: "long" }).format(
    targetDate
  );
  const day = new Intl.DateTimeFormat("ro-RO", { day: "numeric" }).format(
    targetDate
  );
  const month = new Intl.DateTimeFormat("ro-RO", { month: "long" }).format(
    targetDate
  );
  const time = new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(targetDate);

  const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const monthLabel = month.charAt(0).toUpperCase() + month.slice(1);

  return `Live ${weekdayLabel}, ${day} ${monthLabel} la ora ${time}`;
}

export function formatCountdownUnit(value: number) {
  return String(Math.max(value, 0)).padStart(2, "0");
}
