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
    alt: "nt.home.logo.ninja",
    href: NINJATRADER_REGISTER_URL,
    width: 480,
    height: 80,
  },
  kinetick: {
    src: NINJATRADER_ASSETS.kinetickLogo,
    alt: "nt.home.logo.kinetick",
    href: KINETICK_URL,
    width: 480,
    height: 160,
  },
} as const;

export const NINJATRADER_LANDING = {
  platform: {
    links: [
      { id: "platform", href: NINJATRADER_GET_STARTED_URL },
      { id: "download", href: NINJATRADER_DOWNLOAD_URL },
      { id: "simulator", href: NINJATRADER_SIMULATOR_URL },
    ],
    ctaHref: NINJATRADER_REGISTER_URL,
  },
  kinetick: {
    links: [
      { id: "data", href: KINETICK_URL },
      { id: "historical", href: KINETICK_EOD_URL },
    ],
    ctaHref: KINETICK_URL,
  },
} as const;

export const NINJATRADER_FREE_BENEFITS = [
  "nt.free.futures",
  "nt.free.forex",
  "nt.free.eod",
] as const;

export const FUTURES_RISK_DISCLOSURE =
  "Tranzacționarea futures, valutară și a opțiunilor implică riscuri substanțiale și nu este potrivită pentru fiecare investitor. Un investitor ar putea pierde tot capitalul sau mai mult decât investiția inițială. Capitalul de risc este banii care pot fi pierduți fără a-ți pune în pericol securitatea financiară sau stilul de viață. Doar capitalul de risc ar trebui folosit pentru tranzacționare și doar cei cu capital de risc suficient ar trebui să ia în considerare tranzacționarea. Performanțele trecute nu sunt neapărat indicative pentru rezultatele viitoare.";

export const CFTC_HYPOTHETICAL_DISCLOSURE =
  "Regulile CFTC 4.41 — Rezultatele de performanță ipotetice sau simulate au anumite limitări. Spre deosebire de un istoric real de tranzacționare, rezultatele simulate nu reprezintă tranzacționare efectivă. De asemenea, deoarece tranzacțiile nu au fost executate, rezultatele pot fi sub- sau supra-compensate în privința impactului anumitor factori de piață, cum ar fi lipsa lichidității. Programele de tranzacționare simulate sunt, în general, supuse faptului că sunt concepute cu beneficiul retrospectiv. Nu se face nicio reprezentare că vreun cont va obține sau este probabil să obțină profituri sau pierderi similare cu cele prezentate.";
