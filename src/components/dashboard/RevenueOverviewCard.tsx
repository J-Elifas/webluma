import { Gauge } from "lucide-react";
import RevenueOverviewChart from "./RevenueOverviewChart";
import type { DashboardRevenuePoint } from "@/server/dashboard/types";

interface RevenueOverviewCardProps {
    data: DashboardRevenuePoint[];
}

export default function RevenueOverviewCard({ data }: RevenueOverviewCardProps) {
    return (
        <article className="overflow-hidden rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-lg font-black text-midnight-slate">Revenue overview</h2>
                    <p className="mt-1 text-sm font-medium text-slate-gray">
                        Mock monthly revenue from Jan through Jun.
                    </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-soft-mint/50 px-3 py-1.5 text-xs font-bold text-teal-700">
                    <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                    On pace
                </span>
            </div>
            <div className="mt-6">
                <RevenueOverviewChart data={data} />
            </div>
        </article>
    );
}
