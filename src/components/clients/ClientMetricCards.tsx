import { TrendingUp, UserCheck, UserRoundPlus, UsersRound } from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import { formatDateValue } from "@/lib/utils";
import type { ClientRow } from "@/server/clients/types";

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

export default function ClientMetricCards({ clients }: { clients: ClientRow[] }) {
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
            <MetricCard
                label="Total Clients"
                value={String(totalClients)}
                helper={`+${newThisMonth} this month`}
                tone="mint"
                icon={UsersRound}
            />
            <MetricCard
                label="Active Clients"
                value={String(activeClients)}
                helper={activePercent}
                tone="blue"
                icon={UserCheck}
            />
            <MetricCard
                label="Inactive Clients"
                value={String(inactiveClients)}
                helper={inactiveClients > 0 ? "Need attention" : "No inactive clients"}
                tone="amber"
                icon={UserRoundPlus}
            />
            <MetricCard
                label="New This Month"
                value={String(newThisMonth)}
                helper={getNewClientGrowthHelper(newThisMonth, newLastMonth)}
                tone="mint"
                icon={TrendingUp}
            />
        </section>
    );
}
