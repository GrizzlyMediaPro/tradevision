export const NINJATRADER_REGISTER_URL =
  "https://account.ninjatrader.com/register?introducingPartner=TradersHubSRL";

export const KINETICK_URL = "http://kinetick.com/NinjaTrader";

export const NINJATRADER_GET_STARTED_URL = "http://ninjatrader.com/GetStarted";
export const NINJATRADER_DOWNLOAD_URL = "http://ninjatrader.com";
export const NINJATRADER_SIMULATOR_URL = "http://ninjatrader.com/Simulate";
export const KINETICK_EOD_URL = "http://www.kinetick.com/end-of-day";

export const NINJATRADER_MEDIA_KIT_URL =
  "https://ninjatraderecosystem.com/Vendor/Media-Kit.php";

/** Pagină proprie de divulgare a riscului (cerință NinjaTrader Ecosystem). */
export const TRADE_VISION_RISK_DISCLOSURE_PATH = "/declaratie-risc";

export const TESTIMONIAL_DISCLOSURE =
  "Testimonialele de pe acest site pot să nu fie reprezentative pentru experiența altor clienți și nu constituie o garanție a performanței sau succesului viitor.";

export const LIVE_TRADE_ROOM_DISCLOSURE =
  "Această prezentare are scop exclusiv educațional, iar opiniile exprimate sunt doar ale prezentatorului. Toate tranzacțiile prezentate trebuie considerate ipotetice și nu ar trebui să te aștepți să le replicezi într-un cont de tranzacționare live.";

export const NINJATRADER_ASSETS = {
  wordmark: "/ninjatrader/NinjaTrader_Wordmark_color_RGB.png",
  monitor: "/ninjatrader/NinjaTrader_Monitor_Image.png",
  kinetickLogo: "/ninjatrader/Kinetick_Logo.png",
  kinetickBadge: "/ninjatrader/Kinetick_Badge.png",
} as const;

export const NINJATRADER_HOME_LOGOS = {
  ninjaTrader: {
    src: NINJATRADER_ASSETS.wordmark,
    alt: "NinjaTrader — Începe acum",
    href: NINJATRADER_REGISTER_URL,
    width: 480,
    height: 80,
  },
  kinetick: {
    src: NINJATRADER_ASSETS.kinetickLogo,
    alt: "Kinetick — Serviciu recomandat de date de piață",
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
  "Tranzacționarea futures, valutară și a opțiunilor implică riscuri substanțiale și nu este potrivită pentru fiecare investitor. Un investitor ar putea pierde tot capitalul sau mai mult decât investiția inițială. Capitalul de risc este banii care pot fi pierduți fără a-ți pune în pericol securitatea financiară sau stilul de viață. Doar capitalul de risc ar trebui folosit pentru tranzacționare și doar cei cu capital de risc suficient ar trebui să ia în considerare tranzacționarea. Performanțele trecute nu sunt neapărat indicative pentru rezultatele viitoare.";

export const CFTC_HYPOTHETICAL_DISCLOSURE =
  "Regulile CFTC 4.41 — Rezultatele de performanță ipotetice sau simulate au anumite limitări. Spre deosebire de un istoric real de tranzacționare, rezultatele simulate nu reprezintă tranzacționare efectivă. De asemenea, deoarece tranzacțiile nu au fost executate, rezultatele pot fi sub- sau supra-compensate în privința impactului anumitor factori de piață, cum ar fi lipsa lichidității. Programele de tranzacționare simulate sunt, în general, supuse faptului că sunt concepute cu beneficiul retrospectiv. Nu se face nicio reprezentare că vreun cont va obține sau este probabil să obțină profituri sau pierderi similare cu cele prezentate.";
