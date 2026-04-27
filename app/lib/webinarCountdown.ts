export function getWebinarCountdownTarget() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  return new Date(currentYear, currentMonth, currentDate + 7, 19, 0, 0).getTime();
}

export function formatCountdownUnit(value: number) {
  return String(Math.max(value, 0)).padStart(2, "0");
}
