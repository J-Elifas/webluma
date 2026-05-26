import SectionHeading from "@/components/ui/SectionHeading";
import DashboardMetricCards from "./DashboardMetricCards";
import NeedsAttentionCard from "./NeedsAttentionCard";
import QuickActionsCard from "./QuickActionsCard";
import RecentClientsTable from "./RecentClientsTable";
import RevenueOverviewCard from "./RevenueOverviewCard";
import type { DashboardOverview } from "@/server/dashboard/types";

interface DashboardContentProps {
    overview: DashboardOverview;
}

export default function DashboardContent({ overview }: DashboardContentProps) {
    return (
        <>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <SectionHeading
                    title="Welcome back"
                    subtitle="Track your clients, invoices, and monthly business performance."
                />
                <div className="rounded-2xl border border-mist-gray/70 bg-cloud-white/80 px-4 py-3">
                    <p className="text-xs font-bold uppercase text-slate-gray">Current MRR</p>
                    <p className="mt-1 text-2xl font-black text-midnight-slate">
                        {overview.currentMrr}
                    </p>
                </div>
            </section>

            <DashboardMetricCards metrics={overview.metrics} />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
                <RevenueOverviewCard data={overview.revenue} />
                <NeedsAttentionCard items={overview.attentionItems} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <RecentClientsTable clients={overview.recentClients} />
                <QuickActionsCard actions={overview.quickActions} isGuest={overview.isGuest} />
            </section>
        </>
    );
}
