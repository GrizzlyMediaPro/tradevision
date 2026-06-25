"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { reconcileStuckCourseOrder, deleteStuckCourseOrder } from "@/app/admin/actions/practicalCourse";

export type PaidCourseClientRow = {
  id: string;
  clientName: string;
  email: string | null;
  personType: string | null;
  discountCode: string | null;
  paidAmount: string;
  paidAt: string;
};

export type StuckCourseOrderRow = {
  id: string;
  clientName: string;
  email: string | null;
  paidAmount: string;
  amountRon: number | null;
  stripeSessionId: string | null;
  updatedAt: string;
};

type AdminPracticalCourseClientsClientProps = {
  clients: PaidCourseClientRow[];
  stuckOrders: StuckCourseOrderRow[];
};

function clientMatchesNameSearch(client: PaidCourseClientRow, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return client.clientName.toLowerCase().includes(normalized);
}

export function AdminPracticalCourseClientsClient({
  clients,
  stuckOrders,
}: AdminPracticalCourseClientsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [reconcileMessage, setReconcileMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredClients = useMemo(
    () => clients.filter((client) => clientMatchesNameSearch(client, searchTerm)),
    [clients, searchTerm],
  );

  const handleReconcile = (orderId: string) => {
    setReconcileMessage(null);
    startTransition(async () => {
      try {
        const result = await reconcileStuckCourseOrder(orderId);
        if (result.status === "paid") {
          setReconcileMessage(
            result.fulfillmentSent
              ? `Comanda ${orderId} a fost marcată plătită și emailul a fost trimis.`
              : `Comanda ${orderId} a fost marcată plătită, dar emailul nu s-a trimis încă.`,
          );
        } else if (result.status === "pending") {
          setReconcileMessage(
            `Comanda ${orderId} nu este încă plătită în Stripe.`,
          );
        } else {
          setReconcileMessage(`Comanda ${orderId} nu a fost găsită.`);
        }
        router.refresh();
      } catch (err) {
        setReconcileMessage(
          err instanceof Error ? err.message : "Reconcilierea a eșuat.",
        );
      }
    });
  };

  const handleDelete = (orderId: string, clientName: string) => {
    const confirmed = window.confirm(
      `Ștergi comanda pentru ${clientName}? Folosește doar dacă ai verificat în Stripe că plata NU s-a făcut.`,
    );
    if (!confirmed) return;

    setReconcileMessage(null);
    startTransition(async () => {
      try {
        const result = await deleteStuckCourseOrder(orderId);
        setReconcileMessage(
          result.alreadyGone
            ? `Comanda pentru ${clientName} nu mai există în baza de date — a fost eliminată din listă.`
            : `Comanda pentru ${clientName} a fost ștearsă.`,
        );
        router.refresh();
      } catch (err) {
        setReconcileMessage(
          err instanceof Error ? err.message : "Ștergerea a eșuat.",
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      {stuckOrders.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-amber-300">
              Comenzi blocate la plată
            </h2>
            <p className="mt-1 text-sm text-white/55">
              Checkout inițiat, dar nefinalizat în sistem. Dacă plata apare în
              Stripe, apasă Reconciliază. Dacă ai verificat că nu s-a plătit,
              poți șterge comanda.
            </p>
          </div>
          {reconcileMessage ? (
            <p className="text-sm text-emerald-300">{reconcileMessage}</p>
          ) : null}
          <div className="overflow-x-auto rounded-2xl border border-amber-400/20 bg-amber-400/5">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-amber-400/15 text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Sumă</th>
                  <th className="px-4 py-3 font-medium">Ultima actualizare</th>
                  <th className="px-4 py-3 font-medium">Acțiune</th>
                </tr>
              </thead>
              <tbody>
                {stuckOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5">
                    <td className="px-4 py-3">{order.clientName}</td>
                    <td className="px-4 py-3">{order.email || "-"}</td>
                    <td className="px-4 py-3">
                      {order.amountRon
                        ? `${order.amountRon.toFixed(2)} RON`
                        : order.paidAmount}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.updatedAt).toLocaleString("ro-RO")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleReconcile(order.id)}
                          className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:opacity-50"
                        >
                          Reconciliază
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(order.id, order.clientName)}
                          className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-400/20 disabled:opacity-50"
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
      <div className="relative">
        <FaSearch
          className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35"
          aria-hidden
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Caută după nume..."
          className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-purple-400/45 focus:bg-black/40 focus:ring-1 focus:ring-purple-400/25"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {searchTerm.trim() ? (
        <p className="text-xs text-white/45">
          {filteredClients.length} din {clients.length} clienți
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/3">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-white/50">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Tip</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Sumă plătită</th>
              <th className="px-4 py-3 font-medium">Data plății</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/50">
                  Nu există clienți plătitori încă.
                </td>
              </tr>
            ) : filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/50">
                  Niciun client nu se potrivește căutării. Încearcă alt nume sau
                  șterge filtrul.
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-white/5">
                  <td className="px-4 py-3">{client.clientName}</td>
                  <td className="px-4 py-3">{client.email || "-"}</td>
                  <td className="px-4 py-3">{client.personType ?? "-"}</td>
                  <td className="px-4 py-3">{client.discountCode ?? "-"}</td>
                  <td className="px-4 py-3">{client.paidAmount}</td>
                  <td className="px-4 py-3">
                    {new Date(client.paidAt).toLocaleString("ro-RO")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </section>
    </div>
  );
}
