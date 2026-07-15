export type PayoutTrackerAccount = {
  name: string;
  balanta: number;
  actual: number;
  target: number;
  zile: number;
  payout: boolean;
  payoutSuma?: number;
};

export type PayoutTrackerFirm = {
  name: string;
  luna: string;
  investitii?: number;
  payouts?: number;
  accounts: PayoutTrackerAccount[];
};

export type PayoutTrackerData = {
  firms: PayoutTrackerFirm[];
};

export type PayoutTrackerState = PayoutTrackerData & {
  date: string;
};

export type PayoutTrackerHistoryItem = {
  date: string;
  updatedAt: string;
};
