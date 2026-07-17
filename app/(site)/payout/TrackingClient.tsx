"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaExternalLinkAlt, FaPen } from "react-icons/fa";
import {
  allowsFunctionalLocalStorage,
  readConsentFromStorage,
} from "@/lib/cookieConsent";
import type {
  PayoutTrackerAccount as Account,
  PayoutTrackerHistoryItem,
  PayoutTrackerState as TrackerState,
} from "@/lib/payoutTracker/types";
import {
  isValidTrackerData,
  isValidTrackerState,
} from "@/lib/payoutTracker/validation";

const STORAGE_KEY = "tradevision-payout-tracker-v1";

type PartnerLink = { name: string; url: string };

// Fallback dacă nu există firme configurate în admin (/admin/tracking-firms)
const DEFAULT_PARTNER_LINKS: PartnerLink[] = [
  { name: "Tradeify", url: "https://tradeify.co/?ref=TVR" },
  { name: "BlueGuardian", url: "https://blueguardian.com/?afmc=TVR" },
  {
    name: "TopOneFutures",
    url: "https://toponefutures.com/?linkId=lp_707970&sourceId=tvr&tenantId=toponefutures",
  },
  { name: "FundedNext", url: "https://fundednext.com/?fpr=pasatu80" },
  { name: "HolaPrime", url: "https://holaprime.com?affiliateId=TVR" },
];

const COLS = [
  "Cont",
  "Balanță",
  "Profit actual",
  "Profit necesar",
  "Zile rămase",
  "Gata",
  "Gata de payout",
  "",
];

const BALANCE_OPTIONS = [25_000, 50_000, 100_000, 150_000, 300_000] as const;

const GRID_COLS = "1.2fr 1fr 1fr 1fr 0.8fr 1fr 170px 34px";

function todayIso(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
    t.getDate()
  ).padStart(2, "0")}`;
}

function emptyAccount(index: number): Account {
  return {
    name: `Contul ${index}`,
    balanta: 0,
    actual: 0,
    target: 0,
    zile: 0,
    payout: false,
  };
}

function defaultState(date = todayIso()): TrackerState {
  const month = date.slice(0, 7);
  return {
    date,
    firms: [
      {
        name: "Tradeify",
        luna: month,
        accounts: Array.from({ length: 5 }, (_, i) => emptyAccount(i + 1)),
      },
      {
        name: "Blue Guardian",
        luna: month,
        accounts: Array.from({ length: 5 }, (_, i) => emptyAccount(i + 1)),
      },
    ],
  };
}

function fmt(n: number): string {
  return (Number(n) || 0).toLocaleString("ro-RO");
}

function formatRoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const inputBase =
  "w-full min-w-0 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none transition focus:border-purple-400/60";

/** Input de sume: formatare automată „1.234 $" în timp ce tastezi. */
function MoneyInput({
  value,
  onChange,
  positive = false,
}: {
  value: number;
  onChange: (v: number) => void;
  positive?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? `${fmt(value)} $`;

  const handleInput = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    const v = Number(digits) || 0;
    setDraft(digits === "" ? "" : `${fmt(v)} $`);
    onChange(v);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(e) => handleInput(e.target.value)}
      onBlur={() => setDraft(null)}
      className={`${inputBase} text-center tabular-nums ${
        positive ? "border-emerald-400/30 font-medium text-emerald-300" : ""
      }`}
    />
  );
}

function HowItWorks() {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/3 overflow-hidden transition-colors hover:border-white/15">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-sm md:text-base font-semibold text-white">
          Cum funcționează tracker-ul?
        </span>
        <FaChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? `${height}px` : "0px" }}
      >
        <div ref={contentRef} className="px-6 pb-5">
          <ul className="flex flex-col gap-2 text-xs md:text-sm text-white/50 leading-relaxed text-left list-disc pl-4 marker:text-white/30">
            <li>
              Completezi pentru fiecare cont: balanța, profitul actual,
              profitul necesar pentru payout și zilele profitabile rămase.
            </li>
            <li>
              Coloana „Gata” o bifezi tu când ai atins profitul necesar —
              bifată, contul apare marcat cu „Gata ✓”.
            </li>
            <li>
              „Gata de payout” o bifezi tu manual — după bifare apare un câmp
              în care treci suma payout-ului.
            </li>
            <li>
              Fiecare firmă are sus luna, investițiile și payout-urile —
              profitul se calculează automat (payouts − investiții).
            </li>
            <li>
              Poți redenumi firmele și conturile dând click direct pe nume, și
              poți adăuga sau șterge oricâte vrei.
            </li>
            <li>
              După modificări apasă „Salvează” — datele sunt păstrate în
              contul tău. Zilele fără salvare preiau automat ultima zi salvată,
              până la următoarea salvare. În „My Payouts” găsești statistici,
              istoricul salvărilor și exportul în CSV.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function TrackingClient({
  initialDate,
  partnerLinks,
}: {
  initialDate?: string;
  partnerLinks?: PartnerLink[];
}) {
  const partners =
    partnerLinks && partnerLinks.length > 0
      ? partnerLinks
      : DEFAULT_PARTNER_LINKS;
  const [state, setState] = useState<TrackerState | null>(null);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carriedFrom, setCarriedFrom] = useState<string | null>(null);
  const [localMigration, setLocalMigration] = useState<TrackerState | null>(null);
  const fetchHistory = useCallback(async () => {
    const response = await fetch("/api/payout/history", { cache: "no-store" });
    const result = (await response.json()) as {
      snapshots?: PayoutTrackerHistoryItem[];
      error?: string;
    };
    if (!response.ok || !Array.isArray(result.snapshots)) {
      throw new Error(result.error || "Istoricul nu a putut fi încărcat.");
    }
    return result.snapshots;
  }, []);

  const fetchSnapshot = useCallback(async (date: string) => {
    const response = await fetch(
      `/api/payout?date=${encodeURIComponent(date)}`,
      { cache: "no-store" },
    );
    const result = (await response.json()) as {
      data?: unknown;
      carriedFrom?: string | null;
      error?: string;
    };
    if (!response.ok) {
      throw new Error(result.error || "Datele nu au putut fi încărcate.");
    }
    if (result.data !== null && !isValidTrackerData(result.data)) {
      throw new Error("Datele salvate au un format invalid.");
    }
    const source =
      typeof result.carriedFrom === "string" ? result.carriedFrom : null;
    if (result.data === null) {
      return { state: defaultState(date), carriedFrom: null };
    }
    return {
      state: { date, firms: result.data.firms },
      carriedFrom: source,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const date = initialDate ?? todayIso();
      try {
        const [snapshots, loaded] = await Promise.all([
          fetchHistory(),
          fetchSnapshot(date),
        ]);
        if (cancelled) return;
        setState(loaded.state);
        setCarriedFrom(loaded.carriedFrom);

        if (
          snapshots.length === 0 &&
          allowsFunctionalLocalStorage(readConsentFromStorage())
        ) {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed: unknown = raw ? JSON.parse(raw) : null;
            if (isValidTrackerState(parsed)) {
              setLocalMigration(parsed);
            }
          } catch {
            /* date locale corupte */
          }
        }
      } catch (loadError) {
        if (cancelled) return;
        setState(defaultState(date));
        setCarriedFrom(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Datele nu au putut fi încărcate.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [fetchHistory, fetchSnapshot, initialDate]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const update = useCallback((mutate: (draft: TrackerState) => void) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
    setDirty(true);
    setSavedFlash(false);
  }, []);

  const selectDate = useCallback(
    async (date: string) => {
      if (state?.date === date || loading) return;
      if (
        dirty &&
        !window.confirm(
          "Ai modificări nesalvate. Vrei să schimbi ziua și să le pierzi?",
        )
      ) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const loaded = await fetchSnapshot(date);
        setState(loaded.state);
        setCarriedFrom(loaded.carriedFrom);
        setDirty(false);
        setSavedFlash(false);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Datele nu au putut fi încărcate.",
        );
      } finally {
        setLoading(false);
      }
    },
    [dirty, fetchSnapshot, loading, state?.date],
  );

  const saveSnapshot = useCallback(async (snapshot: TrackerState) => {
    const response = await fetch("/api/payout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: snapshot.date,
        data: { firms: snapshot.firms },
      }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(result.error || "Datele nu au putut fi salvate.");
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!state || saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveSnapshot(state);
      setDirty(false);
      setCarriedFrom(null);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Datele nu au putut fi salvate.",
      );
    } finally {
      setSaving(false);
    }
  }, [saveSnapshot, saving, state]);

  const migrateLocalData = useCallback(async () => {
    if (!localMigration || saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveSnapshot(localMigration);
      setState(localMigration);
      setDirty(false);
      setCarriedFrom(null);
      setLocalMigration(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* storage indisponibil */
      }
    } catch (migrationError) {
      setError(
        migrationError instanceof Error
          ? migrationError.message
          : "Datele locale nu au putut fi importate.",
      );
    } finally {
      setSaving(false);
    }
  }, [localMigration, saveSnapshot, saving]);

  if (!state) {
    return <div className="min-h-screen" />;
  }

  return (
    <section className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-16 pb-16">
      <div className="w-full flex flex-col items-center gap-8">
        {/* Titlu secțiune */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-wide uppercase">
            Payout Tracker
          </h1>
          <div className="mt-3 h-[2px] w-[90px] bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
          <p className="mt-4 text-xs md:text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
            Ține evidența conturilor tale de prop firm: balanțe, profit,
            target de payout și zile profitabile rămase — totul într-un singur
            loc.
          </p>
        </div>

        {/* Toolbar */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 shadow-sm shadow-black/40">
            <label
              htmlFor="trackerDate"
              className="text-xs font-medium text-white/50"
            >
              Data
            </label>
            <input
              id="trackerDate"
              type="date"
              value={state.date}
              onChange={(e) => {
                if (e.target.value) {
                  void selectDate(e.target.value);
                }
              }}
              disabled={loading}
              className="cursor-pointer bg-transparent text-xs font-medium text-white/85 outline-none [color-scheme:dark]"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-2 text-xs font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Se salvează..." : "Salvează"}
          </button>

          <Link
            href="/payout/mypayouts"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-purple-600 px-6 py-2 text-xs font-semibold text-white hover:brightness-110 transition cursor-pointer"
          >
            My Payouts
          </Link>

          {(dirty || savedFlash) && (
            <span
              className={`text-[11px] ${
                savedFlash ? "text-emerald-300" : "text-white/40"
              }`}
            >
              {savedFlash ? "Salvat" : "Modificări nesalvate"}
            </span>
          )}
        </div>

        {carriedFrom && !dirty && (
          <p className="w-full text-center text-[11px] text-white/45">
            Nu există salvare pe această zi — afișăm datele din{" "}
            <span className="text-white/70">{formatRoDate(carriedFrom)}</span>.
            Apasă „Salvează” ca să le păstrezi pentru ziua curentă.
          </p>
        )}

        {error && (
          <div className="w-full rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-4">
            <p className="text-center text-xs leading-relaxed text-red-200">
              {error}
            </p>
          </div>
        )}

        {localMigration && (
          <div className="flex w-full flex-col items-center justify-between gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/5 px-6 py-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-medium text-white">
                Am găsit date salvate anterior în acest browser.
              </p>
              <p className="mt-1 text-xs text-white/50">
                Le poți muta în contul tău pentru a le accesa de pe orice
                dispozitiv.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setLocalMigration(null)}
                className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/65 transition hover:bg-white/10"
              >
                Nu acum
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void migrateLocalData()}
                className="cursor-pointer rounded-full bg-yellow-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
              >
                Importă în cont
              </button>
            </div>
          </div>
        )}

        {/* Firme partenere */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/3 px-6 py-6 md:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <h2 className="text-sm md:text-base font-semibold text-white">
                Firmele pe care noi le folosim
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Cele mai bune reduceri cu codul{" "}
                <span className="font-semibold text-white/85">TVR</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {partners.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium text-white/90 hover:bg-white/10 transition cursor-pointer"
                >
                  {p.name}
                  <FaExternalLinkAlt className="h-2.5 w-2.5 text-white/40" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <HowItWorks />

        {/* Firme */}
        <div className="w-full flex flex-col gap-6">
          {state.firms.map((firm, fi) => {
            const profit =
              (Number(firm.payouts) || 0) - (Number(firm.investitii) || 0);
            return (
              <div
                key={fi}
                className="w-full rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-white/2 px-5 py-5 md:px-6"
              >
                {/* Head firmă */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <div className="group flex min-w-[140px] flex-1 items-center gap-2.5">
                    <FaPen className="pointer-events-none h-3 w-3 shrink-0 text-white/25 transition group-focus-within:text-yellow-300/70" />
                    <input
                      value={firm.name}
                      placeholder="Nume firmă"
                      onChange={(e) =>
                        update((d) => {
                          d.firms[fi].name = e.target.value;
                        })
                      }
                      className="min-w-0 flex-1 bg-transparent text-base md:text-lg font-semibold text-white outline-none border-b border-transparent focus:border-white/25 transition"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <input
                      type="month"
                      value={firm.luna || state.date.slice(0, 7)}
                      onChange={(e) => {
                        if (e.target.value) {
                          update((d) => {
                            d.firms[fi].luna = e.target.value;
                          });
                        }
                      }}
                      className="cursor-pointer rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white/85 outline-none [color-scheme:dark] focus:border-purple-400/60"
                    />

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        Investiții
                      </span>
                      <div className="w-[110px]">
                        <MoneyInput
                          value={firm.investitii || 0}
                          onChange={(v) =>
                            update((d) => {
                              d.firms[fi].investitii = v;
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        Payouts
                      </span>
                      <div className="w-[110px]">
                        <MoneyInput
                          value={firm.payouts || 0}
                          onChange={(v) =>
                            update((d) => {
                              d.firms[fi].payouts = v;
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        Profit
                      </span>
                      <span
                        className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                          profit > 0
                            ? "text-emerald-400"
                            : profit < 0
                              ? "text-red-300"
                              : "text-white/60"
                        }`}
                      >
                        {fmt(profit)} $
                      </span>
                    </div>

                    <button
                      title="Șterge firma"
                      onClick={() => {
                        if (
                          confirm(
                            `Ștergi firma „${firm.name || "fără nume"}" cu toate conturile ei?`
                          )
                        ) {
                          update((d) => {
                            d.firms.splice(fi, 1);
                          });
                        }
                      }}
                      className="text-[11px] text-red-300 hover:text-red-200 cursor-pointer ml-1"
                    >
                      Șterge firma
                    </button>
                  </div>
                </div>

                {/* Tabel conturi */}
                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[1000px]">
                    <div
                      className="grid items-center gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/60"
                      style={{ gridTemplateColumns: GRID_COLS }}
                    >
                      {COLS.map((c, i) => (
                        <span
                          key={i}
                          className={i === 0 ? "text-left" : "text-center"}
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-col">
                      {firm.accounts.map((acc, ai) => {
                        const balanta = Number(acc.balanta) || 0;
                        const knownBalance = (
                          BALANCE_OPTIONS as readonly number[]
                        ).includes(balanta);
                        return (
                          <div
                            key={ai}
                            className="grid items-center gap-4 px-4 py-2.5 border-b border-white/5 last:border-b-0"
                            style={{ gridTemplateColumns: GRID_COLS }}
                          >
                            <input
                              value={acc.name}
                              placeholder="Nume cont"
                              onChange={(e) =>
                                update((d) => {
                                  d.firms[fi].accounts[ai].name =
                                    e.target.value;
                                })
                              }
                              className={`${inputBase} font-medium`}
                            />
                            <select
                              value={balanta > 0 ? balanta : ""}
                              onChange={(e) =>
                                update((d) => {
                                  d.firms[fi].accounts[ai].balanta =
                                    Number(e.target.value) || 0;
                                })
                              }
                              className={`${inputBase} cursor-pointer text-center tabular-nums [&>option]:bg-zinc-900`}
                            >
                              <option value="" disabled>
                                Alege
                              </option>
                              {!knownBalance && balanta > 0 && (
                                <option value={balanta}>
                                  {fmt(balanta)} $
                                </option>
                              )}
                              {BALANCE_OPTIONS.map((v) => (
                                <option key={v} value={v}>
                                  {fmt(v)} $
                                </option>
                              ))}
                            </select>
                            <MoneyInput
                              value={acc.actual}
                              onChange={(v) =>
                                update((d) => {
                                  d.firms[fi].accounts[ai].actual = v;
                                })
                              }
                            />
                            <MoneyInput
                              value={acc.target}
                              onChange={(v) =>
                                update((d) => {
                                  d.firms[fi].accounts[ai].target = v;
                                })
                              }
                            />
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={acc.zile}
                              onChange={(e) =>
                                update((d) => {
                                  d.firms[fi].accounts[ai].zile =
                                    Number(e.target.value) || 0;
                                })
                              }
                              className={`${inputBase} text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                            />
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!acc.gata}
                                onChange={(e) =>
                                  update((d) => {
                                    d.firms[fi].accounts[ai].gata =
                                      e.target.checked;
                                  })
                                }
                                className="peer sr-only"
                              />
                              <span className="flex h-5 w-5 items-center justify-center rounded-md border border-white/20 bg-black/40 text-transparent transition-all duration-150 peer-checked:border-emerald-400/60 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:shadow-[0_0_12px_rgba(16,185,129,0.45)] peer-hover:border-white/40 peer-checked:peer-hover:border-emerald-300">
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={3.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </span>
                            </label>
                            <div className="flex min-w-0 flex-col items-stretch gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  update((d) => {
                                    d.firms[fi].accounts[ai].payout =
                                      !d.firms[fi].accounts[ai].payout;
                                  })
                                }
                                className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                                  acc.payout
                                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                                    : "border-white/20 bg-black/40 text-white/50 hover:bg-white/10"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    acc.payout
                                      ? "bg-emerald-400"
                                      : "bg-white/30"
                                  }`}
                                />
                                {acc.payout ? "Gata de payout" : "Nu încă"}
                              </button>
                              {acc.payout && (
                                <MoneyInput
                                  value={acc.payoutSuma || 0}
                                  onChange={(v) =>
                                    update((d) => {
                                      d.firms[fi].accounts[ai].payoutSuma = v;
                                    })
                                  }
                                  positive
                                />
                              )}
                            </div>
                            <button
                              title="Șterge contul"
                              onClick={() =>
                                update((d) => {
                                  d.firms[fi].accounts.splice(ai, 1);
                                })
                              }
                              className="justify-self-center text-white/30 hover:text-red-300 transition cursor-pointer text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() =>
                      update((d) => {
                        d.firms[fi].accounts.push(
                          emptyAccount(d.firms[fi].accounts.length + 1)
                        );
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
                  >
                    + Adaugă cont
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() =>
            update((d) => {
              d.firms.push({
                name: "Firmă nouă",
                luna: state.date.slice(0, 7),
                accounts: [emptyAccount(1)],
              });
            })
          }
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition cursor-pointer"
        >
          + Adaugă firmă
        </button>
      </div>
    </section>
  );
}
