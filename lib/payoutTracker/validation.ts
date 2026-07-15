import type {
  PayoutTrackerAccount,
  PayoutTrackerData,
  PayoutTrackerFirm,
  PayoutTrackerState,
} from "./types";

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidAccount(value: unknown): value is PayoutTrackerAccount {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    isNonNegativeNumber(value.balanta) &&
    isNonNegativeNumber(value.actual) &&
    isNonNegativeNumber(value.target) &&
    isNonNegativeNumber(value.zile) &&
    typeof value.payout === "boolean" &&
    (value.payoutSuma === undefined ||
      isNonNegativeNumber(value.payoutSuma))
  );
}

function isValidFirm(value: unknown): value is PayoutTrackerFirm {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.luna === "string" &&
    MONTH_PATTERN.test(value.luna) &&
    (value.investitii === undefined ||
      isNonNegativeNumber(value.investitii)) &&
    (value.payouts === undefined || isNonNegativeNumber(value.payouts)) &&
    Array.isArray(value.accounts) &&
    value.accounts.every(isValidAccount)
  );
}

export function isValidSnapshotDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidTrackerData(
  value: unknown,
): value is PayoutTrackerData {
  return (
    isRecord(value) &&
    Array.isArray(value.firms) &&
    value.firms.every(isValidFirm)
  );
}

export function isValidTrackerState(
  value: unknown,
): value is PayoutTrackerState {
  return (
    isRecord(value) &&
    isValidSnapshotDate(value.date) &&
    isValidTrackerData({ firms: value.firms })
  );
}
