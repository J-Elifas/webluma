import type { DashboardClient } from "@/server/dashboard/types";

interface RecentClientsTableProps {
    clients: DashboardClient[];
}

function getStatusClass(status: DashboardClient["status"]) {
    if (status === "Past Due") {
        return "bg-rose-100 text-rose-600";
    }

    return "bg-soft-mint/50 text-teal-700";
}

export default function RecentClientsTable({ clients }: RecentClientsTableProps) {
    return (
        <article className="overflow-hidden rounded-[1.25rem] border border-mist-gray/70 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-2 border-b border-mist-gray/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-black text-midnight-slate">Recent clients</h2>
                    <p className="mt-1 text-sm font-medium text-slate-gray">
                        Latest client plan and billing status.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                    <thead>
                        <tr className="bg-cloud-white/80 text-xs font-bold uppercase text-slate-gray">
                            <th className="px-5 py-3">Client</th>
                            <th className="px-5 py-3">Plan</th>
                            <th className="px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-mist-gray/60">
                        {clients.map((client) => (
                            <tr key={client.name}>
                                <td className="px-5 py-4 text-sm font-bold text-midnight-slate">
                                    {client.name}
                                </td>
                                <td className="px-5 py-4 text-sm font-semibold text-slate-gray">
                                    {client.plan}
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClass(
                                            client.status
                                        )}`}
                                    >
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
