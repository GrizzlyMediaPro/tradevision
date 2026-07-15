"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  FaChevronLeft,
  FaEdit,
  FaExternalLinkAlt,
  FaLink,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import {
  createTrackerPartner,
  deleteTrackerPartner,
  getTrackerPartners,
  updateTrackerPartner,
  type TrackerPartner,
} from "../actions/trackerPartners";

type FormState = {
  mode: "create" | "edit";
  editingId: string | null;
  name: string;
  url: string;
};

const EMPTY_FORM: FormState = {
  mode: "create",
  editingId: null,
  name: "",
  url: "",
};

export default function AdminTrackingFirmsPage() {
  const [partners, setPartners] = useState<TrackerPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    getTrackerPartners()
      .then(setPartners)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim() || saving) return;

    setSaving(true);
    try {
      const payload = { name: form.name.trim(), url: form.url.trim() };
      if (form.mode === "create") {
        await createTrackerPartner(payload);
      } else if (form.editingId) {
        await updateTrackerPartner(form.editingId, payload);
      }
      setPartners(await getTrackerPartners());
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner: TrackerPartner) => {
    if (!confirm(`Ștergi firma „${partner.name}” din lista de pe tracker?`)) {
      return;
    }
    await deleteTrackerPartner(partner.id);
    setPartners((prev) => prev.filter((p) => p.id !== partner.id));
    if (form.editingId === partner.id) {
      setForm(EMPTY_FORM);
    }
  };

  return (
    <main className="w-full max-w-[1250px] mx-auto px-4 pt-12 md:pt-24 pb-16">
      <div className="mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <FaChevronLeft className="h-3 w-3" />
          <span>Înapoi la Admin</span>
        </Link>
      </div>

      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-500/15 border border-pink-400/30">
            <FaLink className="h-5 w-5 text-pink-300" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-wide uppercase">
          Firme Tracker
        </h1>
        <div className="mt-3 h-[2px] w-[90px] bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full mx-auto" />
        <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl mx-auto">
          Gestionează lista „Firmele pe care noi le folosim” afișată pe pagina
          Payout Tracker — nume și link de afiliere.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 md:gap-8 items-start">
        {/* Form */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {form.mode === "create" ? "Adaugă firmă" : "Editează firma"}
            </h2>
            {form.mode === "edit" && (
              <button
                type="button"
                onClick={() => setForm(EMPTY_FORM)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/10 transition cursor-pointer"
              >
                <FaTimes className="h-3 w-3" />
                <span>Renunță</span>
              </button>
            )}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Nume firmă
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="ex: Tradeify"
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wider text-white/60">
                Link (cu ref de afiliere)
              </label>
              <input
                value={form.url}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://tradeify.co/?ref=TVR"
                className="rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.url.trim()}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-linear-to-r from-yellow-400 via-amber-300 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_14px_30px_rgba(250,204,21,0.35)] hover:brightness-110 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Se salvează..."
                : form.mode === "create"
                  ? "Adaugă firma"
                  : "Salvează modificările"}
            </button>
          </form>
        </section>

        {/* Listă */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-6 py-7 md:px-8 md:py-9 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-5">
            Firme afișate ({partners.length})
          </h2>

          {loading ? (
            <p className="text-sm text-white/40">Se încarcă...</p>
          ) : partners.length === 0 ? (
            <p className="text-sm leading-relaxed text-white/40">
              Nu există firme în baza de date — pagina de tracking afișează
              lista implicită. Adaugă o firmă pentru a prelua controlul listei.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-linear-to-r from-white/4 to-white/2 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {partner.name}
                    </p>
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex max-w-full items-center gap-1.5 text-xs text-white/45 hover:text-purple-300 transition"
                    >
                      <span className="truncate">{partner.url}</span>
                      <FaExternalLinkAlt className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() =>
                        setForm({
                          mode: "edit",
                          editingId: partner.id,
                          name: partner.name,
                          url: partner.url,
                        })
                      }
                      title="Editează"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      <FaEdit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => void handleDelete(partner)}
                      title="Șterge"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 hover:bg-red-400/15 hover:text-red-300 transition cursor-pointer"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
