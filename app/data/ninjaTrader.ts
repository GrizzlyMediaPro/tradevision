export const NINJATRADER_REGISTER_URL =
  "https://account.ninjatrader.com/register?introducingPartner=TradersHubSRL";

export const KINETICK_URL = "http://kinetick.com/NinjaTrader";

export const NINJATRADER_GET_STARTED_URL = "http://ninjatrader.com/GetStarted";
export const NINJATRADER_DOWNLOAD_URL = "http://ninjatrader.com";
export const NINJATRADER_SIMULATOR_URL = "http://ninjatrader.com/Simulate";
export const KINETICK_EOD_URL = "http://www.kinetick.com/end-of-day";

export const NINJATRADER_MEDIA_KIT_URL =
  "https://ninjatraderecosystem.com/Vendor/Media-Kit.php";

export const NINJATRADER_RISK_DISCLOSURE_URL =
  "https://ninjatraderecosystem.com/Risk-Disclosure.php";

export const NINJATRADER_ASSETS = {
  wordmark: "/ninjatrader/NinjaTrader_Wordmark_color_RGB.png",
  monitor: "/ninjatrader/NinjaTrader_Monitor_Image.png",
  kinetickLogo: "/ninjatrader/Kinetick_Logo.png",
  kinetickBadge: "/ninjatrader/Kinetick_Badge.png",
} as const;

export const NINJATRADER_HOME_LOGOS = {
  ninjaTrader: {
    src: NINJATRADER_ASSETS.wordmark,
    alt: "NinjaTrader — Get Started",
    href: NINJATRADER_REGISTER_URL,
    width: 480,
    height: 80,
  },
  kinetick: {
    src: NINJATRADER_ASSETS.kinetickLogo,
    alt: "Kinetick — Recommended Market Data Service",
    href: KINETICK_URL,
    width: 480,
    height: 160,
  },
} as const;

export const NINJATRADER_LANDING = {
  platform: {
    eyebrow: "Our Recommended Trading Platform",
    intro:
      "NinjaTrader® is our #1 recommended trading software platform preferred by traders worldwide including our clients. Download NinjaTrader & receive immediate FREE access to:",
    benefits: [
      "Real-time futures data",
      "Advanced charting",
      "Trade simulator",
      "Strategy development and backtesting",
    ],
    body: [
      "NinjaTrader's award-winning trading platform is consistently voted an industry leader by the trading community. Featuring 1000s of Apps & Add-Ons for unlimited customization, NinjaTrader is used by over 500,000 traders for advanced market analysis, professional charting and fast order execution.",
      "For new traders, start preparing for the live markets with a free trading simulator featuring real-time market data.",
    ],
    links: [
      { label: "Trading platform", href: NINJATRADER_GET_STARTED_URL },
      { label: "Download NinjaTrader", href: NINJATRADER_DOWNLOAD_URL },
      { label: "Trading simulator", href: NINJATRADER_SIMULATOR_URL },
    ],
    cta: { label: "Get Started for FREE!", href: NINJATRADER_REGISTER_URL },
  },
  kinetick: {
    eyebrow: "Our Recommended Market Data Feed",
    intro:
      "Kinetick® delivers reliable, fast and cost-effective market data to help level the playing field for active traders. Take advantage of unfiltered, real time quotes for stocks, futures and forex that exceed the expectations of the world's most demanding traders, like us! Get started with FREE end-of-day historical market data directly through the NinjaTrader platform and learn how you can significantly reduce CME Group Globex exchange fees on real-time market data with Kinetick.",
    links: [
      { label: "Market data", href: KINETICK_URL },
      { label: "Historical market data", href: KINETICK_EOD_URL },
    ],
    cta: {
      label: "Get Started with Free EOD Data",
      href: KINETICK_URL,
    },
  },
} as const;

export const NINJATRADER_FREE_BENEFITS = [
  "Real-time futures data",
  "Unlimited real-time forex data",
  "EOD data for stocks, futures and forex",
] as const;

export const FUTURES_RISK_DISCLOSURE =
  "Futures, foreign currency and options trading contains substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardizing ones financial security or lifestyle. Only risk capital should be used for trading and only those with sufficient risk capital should consider trading. Past performance is not necessarily indicative of future results.";

export const CFTC_HYPOTHETICAL_DISCLOSURE =
  "CFTC Rules 4.41 - Hypothetical or Simulated performance results have certain limitations, unlike an actual performance record, simulated results do not represent actual trading. Also, since the trades have not been executed, the results may have under-or-over compensated for the impact, if any, of certain market factors, such as lack of liquidity. Simulated trading programs in general are also subject to the fact that they are designed with the benefit of hindsight. No representation is being made that any account will or is likely to achieve profit or losses similar to those shown.";
