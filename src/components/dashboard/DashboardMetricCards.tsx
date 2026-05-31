import { AlertTriangle, CircleDollarSign, ReceiptText, Users, type LucideIcon } from "lucide-react";
import type { DashboardMetric, DashboardMetricIcon, DashboardTone } from "@/server/dashboard/types";

interface DashboardMetricCardsProps {
    metrics: DashboardMetric[];
}

const metricIcons: Record<DashboardMetricIcon, LucideIcon> = {
    revenue: CircleDollarSign,
    clients: Users,
    invoices: ReceiptText,
    risk: AlertTriangle,
};

const toneClasses: Record<DashboardTone, string> = {
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
};

export default function DashboardMetricCards({ metrics }: DashboardMetricCardsProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Business metrics">
            {metrics.map((metric) => {
                const Icon = metricIcons[metric.icon];

                return (
                    <article
                        key={metric.label}
                        className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-slate-gray">{metric.label}</p>
                                <p className="mt-3 text-3xl font-black tracking-normal text-midnight-slate">
                                    {metric.value}
                                </p>
                            </div>
                            <span
                                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${toneClasses[metric.tone]}`}
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-gray">
                            {metric.helper}
                        </p>
                    </article>
                );
            })}
        </section>
    );
}
