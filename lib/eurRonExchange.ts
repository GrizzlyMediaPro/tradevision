export type EurRonQuote = {
  rate: number;
  publishedAt: string;
  source: "bnr" | "env";
};

type CachedQuote = {
  quote: EurRonQuote;
  expiresAt: number;
};

const BNR_RATES_URL = "https://curs.bnr.ro/nbrfxrates.xml";
const CACHE_TTL_MS = 60 * 60 * 1000;

let cachedQuote: CachedQuote | null = null;

function parseEnvRate(): number | null {
  const raw = process.env.EUR_RON_EXCHANGE_RATE?.trim();
  if (!raw) return null;
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) && value > 0 ? value : null;
}

function parseBnrEurRate(xml: string): EurRonQuote | null {
  const publishingDateMatch = xml.match(
    /<PublishingDate>(\d{4}-\d{2}-\d{2})<\/PublishingDate>/,
  );
  const rateMatch = xml.match(/<Rate currency="EUR">([\d.,]+)<\/Rate>/);
  if (!rateMatch) return null;

  const rate = Number(rateMatch[1].replace(",", "."));
  if (!Number.isFinite(rate) || rate <= 0) return null;

  return {
    rate,
    publishedAt: publishingDateMatch?.[1] ?? new Date().toISOString().slice(0, 10),
    source: "bnr",
  };
}

async function fetchBnrQuote(): Promise<EurRonQuote | null> {
  try {
    const response = await fetch(BNR_RATES_URL, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const xml = await response.text();
    return parseBnrEurRate(xml);
  } catch (err) {
    console.warn("Nu s-a putut prelua cursul BNR EUR/RON", err);
    return null;
  }
}

export async function getEurRonQuote(): Promise<EurRonQuote> {
  const now = Date.now();
  if (cachedQuote && cachedQuote.expiresAt > now) {
    return cachedQuote.quote;
  }

  const bnrQuote = await fetchBnrQuote();
  if (bnrQuote) {
    cachedQuote = { quote: bnrQuote, expiresAt: now + CACHE_TTL_MS };
    return bnrQuote;
  }

  const envRate = parseEnvRate();
  if (envRate) {
    const quote: EurRonQuote = {
      rate: envRate,
      publishedAt: new Date().toISOString().slice(0, 10),
      source: "env",
    };
    cachedQuote = { quote, expiresAt: now + CACHE_TTL_MS };
    return quote;
  }

  throw new Error(
    "Cursul EUR/RON nu este disponibil. Configurează EUR_RON_EXCHANGE_RATE sau verifică accesul la BNR.",
  );
}

export function convertEurToRon(amountEur: number, rate: number): number {
  return Math.round(amountEur * rate * 100) / 100;
}

export function formatPriceRon(amountRon: number): string {
  const formatted = amountRon
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} RON`;
}

export function formatEurRonRate(rate: number): string {
  return rate.toFixed(4).replace(".", ",");
}

export function formatRonPaymentLine(input: {
  amountEur: number;
  amountRon: number;
  rate: number;
  publishedAt: string;
  source: EurRonQuote["source"];
}): string {
  const rateLabel =
    input.source === "bnr"
      ? `curs BNR din ${formatRomanianDate(input.publishedAt)}`
      : "curs de schimb configurat";
  return `${formatPriceRon(input.amountRon)} (${rateLabel}: ${formatEurRonRate(input.rate)} lei/EUR)`;
}

function formatRomanianDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}.${month}.${year}`;
}

export function ronToStripeBani(amountRon: number): number {
  return Math.round(amountRon * 100);
}
