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
import {
  ExpiresAtPicker,
  toLocalDatetimeValue,
} from "@/app/components/admin/ExpiresAtPicker";
import { useI18n, useT } from "@/lib/i18n/I18nProvider";

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
  const t = useT();
  const { locale } = useI18n();
  const dateLocale = locale === "ro" ? "ro-RO" : "en-GB";
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
        setError(err instanceof Error ? err.message : t("admin.discounts.error.save"));
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
        ? toLocalDatetimeValue(new Date(row.expiresAt))
        : null,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm(t("admin.discounts.confirmDelete"))) return;
    startTransition(async () => {
      try {
        await deleteDiscountCode(id);
        if (editingId === id) resetForm();
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t("admin.discounts.error.delete"),
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
        <h2 className="text-lg font-semibold">
          {editingId ? t("admin.discounts.editTitle") : t("admin.discounts.newTitle")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label={t("admin.common.code")}>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label={t("admin.common.type")}>
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
              <option value="percent">{t("admin.discounts.percent")}</option>
              <option value="fixed">{t("admin.discounts.fixed")}</option>
            </select>
          </Field>
          <Field label={t("admin.common.value")}>
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
          <Field label={t("admin.discounts.maxUses")}>
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
          <ExpiresAtPicker
            className="sm:col-span-2"
            value={form.expiresAt ?? null}
            onChange={(expiresAt) =>
              setForm((f) => ({
                ...f,
                expiresAt,
              }))
            }
          />
          <label className="flex items-center gap-2 text-sm text-white/75">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((f) => ({ ...f, active: e.target.checked }))
              }
            />
            {t("admin.common.active")}
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
            {isPending
              ? t("admin.common.saving")
              : editingId
                ? t("admin.discounts.update")
                : t("admin.discounts.add")}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/70"
            >
              {t("admin.common.cancel")}
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/3">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-4 py-3">{t("admin.common.code")}</th>
              <th className="px-4 py-3">{t("admin.common.type")}</th>
              <th className="px-4 py-3">{t("admin.common.value")}</th>
              <th className="px-4 py-3">{t("admin.discounts.uses")}</th>
              <th className="px-4 py-3">{t("admin.common.active")}</th>
              <th className="px-4 py-3">{t("admin.discounts.expires")}</th>
              <th className="px-4 py-3">{t("admin.common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {initialCodes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/50">
                  {t("admin.discounts.empty")}
                </td>
              </tr>
            ) : (
              initialCodes.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium">{row.code}</td>
                  <td className="px-4 py-3">
                    {row.type === "percent"
                      ? t("admin.discounts.percent")
                      : t("admin.discounts.fixedShort")}
                  </td>
                  <td className="px-4 py-3">
                    {row.type === "percent" ? `${row.value}%` : `${row.value} EUR`}
                  </td>
                  <td className="px-4 py-3">
                    {row.usedCount}
                    {row.maxUses ? ` / ${row.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {row.active ? t("admin.common.yes") : t("admin.common.no")}
                  </td>
                  <td className="px-4 py-3">
                    {row.expiresAt
                      ? new Date(row.expiresAt).toLocaleString(dateLocale)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="text-yellow-300 hover:underline"
                      >
                        {t("admin.common.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="text-red-300 hover:underline"
                      >
                        {t("admin.common.delete")}
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
