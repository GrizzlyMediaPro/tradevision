import Link from "next/link";
import { redirect } from "next/navigation";
import { getPaidCourseClients } from "@/app/admin/actions/practicalCourse";

export const dynamic = "force-dynamic";

export default async function AdminPracticalCourseClientsPage() {
  const clients = await getPaidCourseClients();

  return (
    <main className="min-h-screen bg-[#020312] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-white/50 hover:text-white">
            ← Admin
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Clienți curs practic</h1>
          <p className="mt-2 text-sm text-white/60">
            Persoane care au finalizat plata pentru cursul practic.
          </p>
        </div>

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
              ) : (
                clients.map((client) => (
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
    </main>
  );
}
