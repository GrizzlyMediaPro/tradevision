"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createDiscountCode,
  deleteDiscountCode,
  updateDiscountCode,
  type DiscountCodeInput,
} from "@/app/admin/actions/practicalCourse";

type DiscountRow = {
  id: string;
  code: string;
  type: string;
  value: number;
  active: boolean;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
};

type AdminDiscountsClientProps = {
  initialCodes: DiscountRow[];
};

const emptyForm: DiscountCodeInput = {
  code: "",
  type: "percent",
  value: 10,
  active: true,
  maxUses: null,
  expiresAt: null,
};

export function AdminDiscountsClient({ initialCodes }: AdminDiscountsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<DiscountCodeInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        setError(null);
        if (editingId) {
          await updateDiscountCode(editingId, form);
        } else {
          await createDiscountCode(form);
        }
        resetForm();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Eroare la salvare.");
      }
    });
  };

  const handleEdit = (row: DiscountRow) => {
    setEditingId(row.id);
    setForm({
      code: row.code,
      type: row.type as "percent" | "fixed",
      value: row.value,
      active: row.active,
      maxUses: row.maxUses,
      expiresAt: row.expiresAt
        ? new Date(row.expiresAt).toISOString().slice(0, 16)
        : null,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Ștergi acest cod de discount?")) return;
    startTransition(async () => {
      try {
        await deleteDiscountCode(id);
        if (editingId === id) resetForm();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Eroare la ștergere.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
        <h2 className="text-lg font-semibold">
          {editingId ? "Editează cod discount" : "Cod discount nou"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Cod">
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Tip">
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value as "percent" | "fixed",
                }))
              }
              className={inputClass}
            >
              <option value="percent">Procent</option>
              <option value="fixed">Sumă fixă EUR</option>
            </select>
          </Field>
          <Field label="Valoare">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </Field>
          <Field label="Utilizări maxime (opțional)">
            <input
              type="number"
              min="1"
              value={form.maxUses ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  maxUses: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className={inputClass}
            />
          </Field>
          <Field label="Expiră la (opțional)" className="sm:col-span-2">
            <input
              type="datetime-local"
              value={form.expiresAt ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  expiresAt: e.target.value || null,
                }))
              }
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-white/75">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            Activ
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-50"
          >
            {isPending ? "Se salvează..." : editingId ? "Actualizează" : "Adaugă cod"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70"
            >
              Anulează
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/3">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-4 py-3">Cod</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Valoare</th>
              <th className="px-4 py-3">Utilizări</th>
              <th className="px-4 py-3">Activ</th>
              <th className="px-4 py-3">Expiră</th>
              <th className="px-4 py-3">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {initialCodes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/50">
                  Nu există coduri de discount.
                </td>
              </tr>
            ) : (
              initialCodes.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium">{row.code}</td>
                  <td className="px-4 py-3">
                    {row.type === "percent" ? "Procent" : "Fix EUR"}
                  </td>
                  <td className="px-4 py-3">
                    {row.type === "percent" ? `${row.value}%` : `${row.value} EUR`}
                  </td>
                  <td className="px-4 py-3">
                    {row.usedCount}
                    {row.maxUses ? ` / ${row.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">{row.active ? "Da" : "Nu"}</td>
                  <td className="px-4 py-3">
                    {row.expiresAt
                      ? new Date(row.expiresAt).toLocaleString("ro-RO")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="text-yellow-300 hover:underline"
                      >
                        Editează
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="text-red-300 hover:underline"
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-white/50">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-300/40";
