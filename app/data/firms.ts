export const platformImages: Record<string, string> = {
  NinjaTrader: "/platforms/ninjatrader.webp",
  Quantower: "/platforms/quantower.webp",
  Rithmic: "/platforms/rithmic.webp",
  "Sierra Chart": "/platforms/sierra-chart.webp",
  TradingView: "/platforms/tradingview.webp",
  Tradovate: "/platforms/tradovate.webp",
};

export interface Challenge {
  accountType: string;
  accountColor: string;
  size: string;
  activation: string;
  fee: string;
  trueCost: string;
  target: string;
  drawdown: string;
}

export interface PayoutStep {
  title: string;
  description: string;
}

export interface RuleTab {
  label: string;
  content: string[];
}

export interface FirmDetail {
  name: string;
  slug: string;
  logo: string;
  payout: string;
  country: string;
  flag: string;
  platforms: string[];
  trustScore: number;
  activeYears: number;
  maxAccounts: string;
  code: string;
  discount: string;
  website: string;
  description: string;
  paymentMethods: string[];
  keyFeatures: { label: string; value: string; enabled: boolean }[];
  challenges: Challenge[];
  payoutTimeline: PayoutStep[];
  rules: RuleTab[];
  excludedCountries: string[];
}

export const firms: FirmDetail[] = [
  {
    name: "Apex Trader Funding",
    slug: "apex-trader-funding",
    logo: "/partnersmock/My-Funded-Futures-8.webp",
    payout: "8 Days",
    country: "US",
    flag: "/countries/us.webp",
    platforms: ["NinjaTrader", "Rithmic", "TradingView", "Tradovate", "Quantower"],
    trustScore: 4.4,
    activeYears: 4,
    maxAccounts: "10+",
    code: "MIKE",
    discount: "90% Off",
    website: "https://apextraderfunding.com",
    description:
      "Apex Trader Funding is one of the most popular futures prop firms, known for its generous 90% profit split and simple evaluation process. With a single-step evaluation and no daily drawdown, Apex has become a go-to choice for futures traders looking for funded accounts with flexible rules.",
    paymentMethods: ["Credit Card", "Debit Card", "Crypto"],
    keyFeatures: [
      { label: "Daily Payouts", value: "NO", enabled: false },
      { label: "1-Day Pass", value: "YES", enabled: true },
      { label: "KYC Required", value: "YES", enabled: true },
      { label: "VPN Allowed", value: "NO", enabled: false },
      { label: "DCA Allowed", value: "YES", enabled: true },
      { label: "Micro-Scalping", value: "YES", enabled: true },
      { label: "Bots Allowed", value: "NO", enabled: false },
    ],
    challenges: [
      { accountType: "Full Account", accountColor: "purple", size: "$25K", activation: "$0", fee: "$147", trueCost: "$147", target: "$1,500", drawdown: "$1,500" },
      { accountType: "Full Account", accountColor: "purple", size: "$50K", activation: "$0", fee: "$167", trueCost: "$167", target: "$3,000", drawdown: "$2,500" },
      { accountType: "Full Account", accountColor: "purple", size: "$75K", activation: "$0", fee: "$187", trueCost: "$187", target: "$4,250", drawdown: "$2,750" },
      { accountType: "Full Account", accountColor: "purple", size: "$100K", activation: "$0", fee: "$207", trueCost: "$207", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Full Account", accountColor: "purple", size: "$150K", activation: "$0", fee: "$297", trueCost: "$297", target: "$9,000", drawdown: "$5,000" },
      { accountType: "Full Account", accountColor: "purple", size: "$250K", activation: "$0", fee: "$517", trueCost: "$517", target: "$15,000", drawdown: "$6,500" },
      { accountType: "Full Account", accountColor: "purple", size: "$300K", activation: "$0", fee: "$657", trueCost: "$657", target: "$20,000", drawdown: "$7,500" },
    ],
    payoutTimeline: [
      { title: "Pass Evaluation", description: "Meet profit target with no trailing drawdown breach" },
      { title: "8 Trading Days", description: "Complete minimum 8 trading days" },
      { title: "First Payout", description: "Available after 8 trading days in funded account" },
      { title: "Every 8 Days", description: "Ongoing payout schedule thereafter" },
    ],
    rules: [
      {
        label: "Evaluation Guidelines",
        content: [
          "Reach the profit target for your account size",
          "Stay within the trailing threshold (Max Loss Limit)",
          "No daily loss limit — only trailing drawdown",
          "Minimum 8 trading days required",
          "Trade during approved market hours",
          "One-direction trading only during evaluation",
          "No hedging or news trading restrictions",
        ],
      },
      {
        label: "Hard Breach Rules",
        content: [
          "The evaluation will fail if the trailing drawdown is breached",
          "Positions must be closed by 4:59 PM ET",
          "No trading during holidays or outside approved hours",
          "Exceeding max contract limits results in failure",
        ],
      },
      {
        label: "Funded Rules",
        content: [
          "Profit Split: 100% of first $25,000 then 90/10 split",
          "Trailing drawdown still applies based on account size",
          "Consistency Rule: No single day > 30% of total profits",
          "Minimum 8 trading days per payout cycle",
          "Minimum withdrawal: $500",
          "Max funded accounts: 20",
        ],
      },
    ],
    excludedCountries: ["AF", "AL", "BY", "BA", "CF", "CD", "CU", "IR", "IQ", "KP", "LB", "LY", "ML", "NI", "RU", "SO", "SS", "SD", "SY", "VE", "YE", "ZW"],
  },
  {
    name: "Take Profit Trader",
    slug: "take-profit-trader",
    logo: "/partnersmock/My-Funded-Futures-4.webp",
    payout: "Daily Payouts",
    country: "US",
    flag: "/countries/us.webp",
    platforms: ["NinjaTrader", "Rithmic", "TradingView", "Tradovate", "Quantower"],
    trustScore: 4.4,
    activeYears: 6,
    maxAccounts: "5",
    code: "PFM",
    discount: "40% Off",
    website: "https://takeprofittrader.com",
    description:
      "Take Profit Trader is a veteran futures prop firm offering daily payouts and a straightforward evaluation process. Known for its trader-friendly rules and fast payout processing, TPT has built a strong reputation over 6 years in the industry.",
    paymentMethods: ["Credit Card", "Debit Card"],
    keyFeatures: [
      { label: "Daily Payouts", value: "YES", enabled: true },
      { label: "1-Day Pass", value: "YES", enabled: true },
      { label: "KYC Required", value: "YES", enabled: true },
      { label: "VPN Allowed", value: "YES", enabled: true },
      { label: "DCA Allowed", value: "YES", enabled: true },
      { label: "Micro-Scalping", value: "YES", enabled: true },
      { label: "Bots Allowed", value: "YES", enabled: true },
    ],
    challenges: [
      { accountType: "Pro Account", accountColor: "purple", size: "$25K", activation: "$0", fee: "$150", trueCost: "$150", target: "$1,500", drawdown: "$1,500" },
      { accountType: "Pro Account", accountColor: "purple", size: "$50K", activation: "$0", fee: "$170", trueCost: "$170", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Pro Account", accountColor: "purple", size: "$75K", activation: "$0", fee: "$245", trueCost: "$245", target: "$4,500", drawdown: "$2,500" },
      { accountType: "Pro Account", accountColor: "purple", size: "$100K", activation: "$0", fee: "$330", trueCost: "$330", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Pro Account", accountColor: "purple", size: "$150K", activation: "$0", fee: "$360", trueCost: "$360", target: "$9,000", drawdown: "$5,000" },
    ],
    payoutTimeline: [
      { title: "Pass Evaluation", description: "Meet profit target and required trading rules" },
      { title: "5 Profitable Days", description: "Complete 5 profitable trading days" },
      { title: "Daily Payouts", description: "Request payouts every trading day" },
      { title: "Ongoing", description: "Continue trading and requesting payouts" },
    ],
    rules: [
      {
        label: "Evaluation Guidelines",
        content: [
          "Reach the profit target for your account size",
          "Stay within the End-of-Day drawdown limit",
          "Follow Daily Loss Limits where applicable",
          "Minimum 5 profitable trading days",
          "Trade within allowed contract limits",
        ],
      },
      {
        label: "Hard Breach Rules",
        content: [
          "Evaluation fails if Maximum Loss Limit is breached",
          "Positions must be closed before market close",
          "Exceeding contract limits results in account failure",
        ],
      },
      {
        label: "Funded Rules",
        content: [
          "Profit Split: 80/20 (80% to trader)",
          "End-of-Day drawdown still applies",
          "No consistency rule",
          "Daily payouts available",
          "Minimum withdrawal: $250",
          "Max funded accounts: 5",
        ],
      },
    ],
    excludedCountries: ["AF", "BY", "CU", "IR", "IQ", "KP", "RU", "SO", "SS", "SY", "VE", "YE"],
  },
  {
    name: "My Funded Futures",
    slug: "my-funded-futures",
    logo: "/partnersmock/My-Funded-Futures-5.webp",
    payout: "Daily Payouts",
    country: "US",
    flag: "/countries/us.webp",
    platforms: ["NinjaTrader", "TradingView", "Tradovate"],
    trustScore: 4.9,
    activeYears: 3,
    maxAccounts: "5",
    code: "MIKE",
    discount: "20% Off",
    website: "https://myfundedfutures.com",
    description:
      "My Funded Futures (MFF) has quickly risen to become one of the highest-rated futures prop firms with a 4.9/5 trust score. Known for daily payouts, no consistency rules, and a simple evaluation, MFF is a top choice for serious futures traders.",
    paymentMethods: ["Credit Card", "Debit Card", "Crypto"],
    keyFeatures: [
      { label: "Daily Payouts", value: "YES", enabled: true },
      { label: "1-Day Pass", value: "NO", enabled: false },
      { label: "KYC Required", value: "YES", enabled: true },
      { label: "VPN Allowed", value: "YES", enabled: true },
      { label: "DCA Allowed", value: "YES", enabled: true },
      { label: "Micro-Scalping", value: "NO", enabled: false },
      { label: "Bots Allowed", value: "NO", enabled: false },
    ],
    challenges: [
      { accountType: "Starter", accountColor: "emerald", size: "$50K", activation: "$0", fee: "$100", trueCost: "$100", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Starter", accountColor: "emerald", size: "$100K", activation: "$0", fee: "$185", trueCost: "$185", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Starter", accountColor: "emerald", size: "$150K", activation: "$0", fee: "$225", trueCost: "$225", target: "$9,000", drawdown: "$4,500" },
      { accountType: "Expert", accountColor: "purple", size: "$50K", activation: "$0", fee: "$150", trueCost: "$150", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Expert", accountColor: "purple", size: "$100K", activation: "$0", fee: "$250", trueCost: "$250", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Expert", accountColor: "purple", size: "$150K", activation: "$0", fee: "$325", trueCost: "$325", target: "$9,000", drawdown: "$4,500" },
    ],
    payoutTimeline: [
      { title: "Pass Evaluation", description: "Meet profit target and follow trading rules" },
      { title: "No Minimum Days", description: "No minimum trading day requirement" },
      { title: "Daily Payouts", description: "Available every trading day after funded" },
      { title: "Ongoing", description: "Continuous payout schedule" },
    ],
    rules: [
      {
        label: "Evaluation Guidelines",
        content: [
          "Reach the profit target for your account size",
          "Stay within the trailing drawdown limit",
          "No minimum trading days required",
          "No consistency rule during evaluation",
          "Trade within allowed contract limits",
        ],
      },
      {
        label: "Hard Breach Rules",
        content: [
          "Evaluation fails if trailing drawdown is breached",
          "No positions held past market close",
          "Contract limits must be respected",
        ],
      },
      {
        label: "Funded Rules",
        content: [
          "Profit Split: 100% of first $10,000 then 90/10",
          "Trailing drawdown applies",
          "No consistency rule",
          "Daily payouts available",
          "Minimum withdrawal: $250",
          "Max funded accounts: 5",
        ],
      },
    ],
    excludedCountries: ["AF", "BY", "CU", "IR", "IQ", "KP", "RU", "SO", "SS", "SY"],
  },
  {
    name: "Lucid Trading",
    slug: "lucid-trading",
    logo: "/partnersmock/My-Funded-Futures-1.webp",
    payout: "5 days",
    country: "US",
    flag: "/countries/us.webp",
    platforms: ["NinjaTrader", "Rithmic", "TradingView", "Tradovate", "Sierra Chart"],
    trustScore: 4.7,
    activeYears: 1,
    maxAccounts: "5",
    code: "MIKE",
    discount: "50% Off",
    website: "https://lucidtrading.com",
    description:
      "Lucid Trading is a futures prop firm best known for its End-of-Day (EOD) drawdown model and exceptionally fast payouts, often processed in under 15 minutes. Traders can choose from multiple funding paths, including Lucid Pro (standard evaluation), Lucid Flex (no daily loss limit and no buffer requirement), and Lucid Direct (instant funding). Unlike many prop firms, Lucid charges a one-time fee rather than a monthly recurring subscription, making it an attractive option for traders who want predictable upfront costs and fast access to capital.",
    paymentMethods: ["Credit Card", "Debit Card"],
    keyFeatures: [
      { label: "Daily Payouts", value: "NO", enabled: false },
      { label: "1-Day Pass", value: "YES", enabled: true },
      { label: "KYC Required", value: "YES", enabled: true },
      { label: "VPN Allowed", value: "NO", enabled: false },
      { label: "DCA Allowed", value: "YES", enabled: true },
      { label: "Micro-Scalping", value: "YES", enabled: true },
      { label: "Bots Allowed", value: "NO", enabled: false },
    ],
    challenges: [
      { accountType: "Pro Account", accountColor: "purple", size: "$25K", activation: "$0", fee: "$60", trueCost: "$60", target: "$1,250", drawdown: "$1,000" },
      { accountType: "Lucid Black", accountColor: "emerald", size: "$25K", activation: "$0", fee: "$65", trueCost: "$65", target: "$1,250", drawdown: "$1,000" },
      { accountType: "Flex Account", accountColor: "sky", size: "$25K", activation: "$0", fee: "$50", trueCost: "$50", target: "$1,250", drawdown: "$1,000" },
      { accountType: "Pro Account", accountColor: "purple", size: "$50K", activation: "$0", fee: "$80", trueCost: "$80", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Lucid Black", accountColor: "emerald", size: "$50K", activation: "$0", fee: "$90", trueCost: "$90", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Flex Account", accountColor: "sky", size: "$50K", activation: "$0", fee: "$65", trueCost: "$65", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Direct Account", accountColor: "yellow", size: "$50K", activation: "$0", fee: "$343", trueCost: "$343", target: "$0", drawdown: "$2,000" },
      { accountType: "Pro Account", accountColor: "purple", size: "$100K", activation: "$0", fee: "$137", trueCost: "$137", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Lucid Black", accountColor: "emerald", size: "$100K", activation: "$0", fee: "$200", trueCost: "$200", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Flex Account", accountColor: "sky", size: "$100K", activation: "$0", fee: "$112", trueCost: "$112", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Pro Account", accountColor: "purple", size: "$150K", activation: "$0", fee: "$185", trueCost: "$185", target: "$9,000", drawdown: "$4,500" },
      { accountType: "Flex Account", accountColor: "sky", size: "$150K", activation: "$0", fee: "$172", trueCost: "$172", target: "$9,000", drawdown: "$4,500" },
      { accountType: "Direct Account", accountColor: "yellow", size: "$150K", activation: "$0", fee: "$532", trueCost: "$532", target: "$0", drawdown: "$6,000" },
    ],
    payoutTimeline: [
      { title: "Pass Evaluation", description: "Meet profit target and required trading rules" },
      { title: "5 Profitable Days", description: "Complete 5 profitable trading days over target" },
      { title: "First Payout", description: "Available after five trading days" },
      { title: "Every 5 Trading Days", description: "Ongoing payout schedule thereafter" },
    ],
    rules: [
      {
        label: "Evaluation Guidelines",
        content: [
          "LucidPro — NO Consistency Rule:",
          "• Reach the profit target for your account size",
          "• Stay within the Max Loss Limit (MLL)",
          "• Follow Daily Loss Limits (DLL) where applicable",
          "• Trade within allowed contract limits",
          "• $25K account has NO DLL",
          "",
          "LucidBlack — Evaluation Rules:",
          "• Reach the profit target",
          "• Stay within the Max Loss Limit",
          "• Maintain 60% or less consistency",
          "• Follow max contract limits",
          "",
          "LucidFlex — Evaluation Rules:",
          "• No daily loss limit and no buffer requirement",
          "• Reach the profit target",
          "• Follow max contract limits",
          "",
          "LucidDirect — No evaluation, instantly funded",
          "",
          "Rules for ALL Lucid Evaluations:",
          "• One-direction trading only (no long + short)",
          "• No hedging",
          "• No simulator exploitation",
          "• Automation allowed if compliant",
          "• Trading must follow approved market hours",
        ],
      },
      {
        label: "Hard Breach Rules",
        content: [
          "The evaluation will fail if the Maximum Loss Limit is breached or if any positions are held past 4:45 PM ET.",
          "For Lucid Pro accounts, reaching the Daily Loss Limit results in a trading pause for the day but does not automatically fail the evaluation.",
        ],
      },
      {
        label: "Funded Rules",
        content: [
          "1. LucidPro Funded Account Rules:",
          "• Profit Split: 100% of first $10,000, then 90/10 split",
          "• EOD drawdown still applies",
          "• Consistency Rule: No single day > 40% of total profit",
          "• Must complete 5 profitable trading days per payout cycle",
          "• Minimum withdrawal: $500",
          "",
          "2. LucidBlack Funded Account Rules:",
          "• Profit Split: 90% to trader, 10% to Lucid",
          "• Consistency Rule: Largest single-day profit ≤ 40%",
          "• No Buffer Rule",
          "",
          "3. LucidFlex Funded Account Rules:",
          "• Profit Split: Flat 90/10",
          "• No Daily Loss Limit once funded",
          "• No consistency percentage once funded",
          "",
          "4. LucidDirect Funded Account Rules:",
          "• Profit Split: 90%, Lucid takes 10%",
          "• Minimum 8 trading days between payout requests",
          "• Consistency: Largest day ≤ 20% of total profits",
          "",
          "General Rules Across All Lucid Accounts:",
          "• All funded accounts use end-of-day drawdown limits",
          "• Profit Split Structure: 90/10 split after initial bonus",
          "• Max Funded Accounts: 5 total across all products",
        ],
      },
    ],
    excludedCountries: [
      "AF", "AL", "DZ", "AO", "BS", "BB", "BY", "BA", "BW", "BG", "BF", "BI", "KH", "CF",
      "CD", "CU", "CI", "EC", "ET", "GH", "GN", "HT", "IS", "ID", "IR", "IQ", "JM", "KE",
      "XK", "LA", "LB", "LR", "LY", "LT", "ML", "MU", "MN", "ME", "MA", "MZ", "MM", "NA",
      "NI", "NG", "MK", "PK", "PA", "PG", "PH", "RU", "SN", "RS", "SI", "SO", "ZA", "SS",
      "LK", "SS", "SY", "TZ", "TT", "TN", "TR", "UG", "UA", "VE", "VN", "YE", "ZW",
    ],
  },
  {
    name: "Tradeify",
    slug: "tradeify",
    logo: "/partnersmock/My-Funded-Futures-7.webp",
    payout: "Daily Payouts",
    country: "US",
    flag: "/countries/us.webp",
    platforms: ["NinjaTrader", "TradingView", "Tradovate"],
    trustScore: 4.6,
    activeYears: 2,
    maxAccounts: "5",
    code: "MIKE",
    discount: "40% Off",
    website: "https://tradeify.com",
    description:
      "Tradeify is a newer prop firm that has quickly gained popularity thanks to its daily payouts, simple rules, and competitive pricing. With a clean evaluation process and no unnecessary restrictions, Tradeify is a great option for traders looking for a hassle-free funded account experience.",
    paymentMethods: ["Credit Card", "Debit Card", "Crypto"],
    keyFeatures: [
      { label: "Daily Payouts", value: "YES", enabled: true },
      { label: "1-Day Pass", value: "YES", enabled: true },
      { label: "KYC Required", value: "YES", enabled: true },
      { label: "VPN Allowed", value: "YES", enabled: true },
      { label: "DCA Allowed", value: "YES", enabled: true },
      { label: "Micro-Scalping", value: "YES", enabled: true },
      { label: "Bots Allowed", value: "NO", enabled: false },
    ],
    challenges: [
      { accountType: "Advanced", accountColor: "purple", size: "$50K", activation: "$0", fee: "$125", trueCost: "$125", target: "$3,000", drawdown: "$2,000" },
      { accountType: "Advanced", accountColor: "purple", size: "$100K", activation: "$0", fee: "$190", trueCost: "$190", target: "$6,000", drawdown: "$3,000" },
      { accountType: "Advanced", accountColor: "purple", size: "$150K", activation: "$0", fee: "$290", trueCost: "$290", target: "$9,000", drawdown: "$4,500" },
      { accountType: "Straight to Funded", accountColor: "emerald", size: "$50K", activation: "$0", fee: "$350", trueCost: "$350", target: "$0", drawdown: "$2,000" },
      { accountType: "Straight to Funded", accountColor: "emerald", size: "$100K", activation: "$0", fee: "$550", trueCost: "$550", target: "$0", drawdown: "$3,000" },
    ],
    payoutTimeline: [
      { title: "Pass Evaluation", description: "Meet profit target and follow rules" },
      { title: "5 Trading Days", description: "Complete minimum 5 trading days" },
      { title: "Daily Payouts", description: "Request payouts daily once funded" },
      { title: "Ongoing", description: "Continuous daily payout access" },
    ],
    rules: [
      {
        label: "Evaluation Guidelines",
        content: [
          "Reach the profit target for your account size",
          "Stay within the trailing drawdown limit",
          "Minimum 5 trading days required",
          "No consistency rule during evaluation",
          "Trade within allowed contract limits",
          "Straight to Funded option skips evaluation",
        ],
      },
      {
        label: "Hard Breach Rules",
        content: [
          "Trailing drawdown breach fails the evaluation",
          "All positions must be closed before market close",
          "Max contract limits must be respected",
        ],
      },
      {
        label: "Funded Rules",
        content: [
          "Profit Split: 90/10 (90% to trader)",
          "Trailing drawdown still applies",
          "No consistency rule while funded",
          "Daily payouts available",
          "Minimum withdrawal: $250",
          "Max funded accounts: 5",
        ],
      },
    ],
    excludedCountries: ["AF", "BY", "CU", "IR", "IQ", "KP", "RU", "SO", "SS", "SY", "VE", "YE"],
  },
];

export function getFirmBySlug(slug: string): FirmDetail | undefined {
  return firms.find((f) => f.slug === slug);
}
