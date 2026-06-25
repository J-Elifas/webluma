import { TrendingUp, UserCheck, UserRoundPlus, UsersRound, type LucideIcon } from "lucide-react";
import { formatDateValue } from "@/lib/utils";
import type { ClientRow } from "@/server/clients/types";

type ClientMetricTone = "amber" | "blue" | "mint" | "rose";

interface ClientMetricCardProps {
    helper: string;
    icon: LucideIcon;
    label: string;
    tone: ClientMetricTone;
    value: string;
}

interface ClientMetricCardsProps {
    clients: ClientRow[];
}

const toneClasses: Record<ClientMetricTone, string> = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    rose: "bg-rose-100 text-rose-600",
};

function ClientMetricCard({ helper, icon: Icon, label, tone, value }: ClientMetricCardProps) {
    return (
        <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-slate-gray">{label}</p>
                    <p className="mt-3 text-3xl font-black tracking-normal text-midnight-slate">
                        {value}
                    </p>
                </div>
                <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
                >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-gray">{helper}</p>
        </article>
    );
}

function getMonthValue(date: Date) {
    return formatDateValue(date).slice(0, 7);
}

function getPreviousMonthValue() {
    const now = new Date();

    return getMonthValue(new Date(now.getFullYear(), now.getMonth() - 1, 1));
}

function getMonthClientCount(clients: ClientRow[], monthValue: string) {
    return clients.filter((client) => client.createdAtValue.startsWith(monthValue)).length;
}

function getNewClientGrowthHelper(newThisMonth: number, newLastMonth: number) {
    if (newLastMonth === 0) {
        return newThisMonth === 0 ? "No change from last month" : "+100% from last month";
    }

    const percentage = Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100);
    const prefix = percentage >= 0 ? "+" : "";

    return `${prefix}${percentage}% from last month`;
}

export default function ClientMetricCards({ clients }: ClientMetricCardsProps) {
    const totalClients = clients.length;
    const activeClients = clients.filter((client) => client.status === "active").length;
    const inactiveClients = clients.filter((client) => client.status === "inactive").length;
    const newThisMonth = getMonthClientCount(clients, getMonthValue(new Date()));
    const newLastMonth = getMonthClientCount(clients, getPreviousMonthValue());
    const activePercent =
        totalClients > 0
            ? `${Math.round((activeClients / totalClients) * 100)}% of total`
            : "No clients yet";

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Client metrics">
            <ClientMetricCard
                label="Total Clients"
                value={String(totalClients)}
                helper={`+${newThisMonth} this month`}
                tone="mint"
                icon={UsersRound}
            />
            <ClientMetricCard
                label="Active Clients"
                value={String(activeClients)}
                helper={activePercent}
                tone="blue"
                icon={UserCheck}
            />
            <ClientMetricCard
                label="Inactive Clients"
                value={String(inactiveClients)}
                helper={inactiveClients > 0 ? "Need attention" : "No inactive clients"}
                tone="amber"
                icon={UserRoundPlus}
            />
            <ClientMetricCard
                label="New This Month"
                value={String(newThisMonth)}
                helper={getNewClientGrowthHelper(newThisMonth, newLastMonth)}
                tone="mint"
                icon={TrendingUp}
            />
        </section>
    );
}
