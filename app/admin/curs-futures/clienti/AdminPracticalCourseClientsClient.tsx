"use client";

import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

export type PaidCourseClientRow = {
  id: string;
  clientName: string;
  email: string | null;
  personType: string | null;
  discountCode: string | null;
  paidAmount: string;
  paidAt: string;
};

type AdminPracticalCourseClientsClientProps = {
  clients: PaidCourseClientRow[];
};

function clientMatchesNameSearch(client: PaidCourseClientRow, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return client.clientName.toLowerCase().includes(normalized);
}

export function AdminPracticalCourseClientsClient({
  clients,
}: AdminPracticalCourseClientsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = useMemo(
    () => clients.filter((client) => clientMatchesNameSearch(client, searchTerm)),
    [clients, searchTerm],
  );

  return (
    <div className="space-y-4">
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
    </div>
  );
}
