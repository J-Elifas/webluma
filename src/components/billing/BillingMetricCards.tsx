import { AlertTriangle, CircleDollarSign, Clock, ReceiptText, type LucideIcon } from "lucide-react";

type BillingMetricTone = "amber" | "blue" | "mint" | "rose";

interface BillingMetricCardProps {
    helper: string;
    icon: LucideIcon;
    label: string;
    tone: BillingMetricTone;
    value: string;
}

const toneClasses: Record<BillingMetricTone, string> = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    rose: "bg-rose-100 text-rose-600",
};

function BillingMetricCard({ helper, icon: Icon, label, tone, value }: BillingMetricCardProps) {
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

export default function BillingMetricCards() {
    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Billing metrics">
            <BillingMetricCard
                label="Paid revenue"
                value="$24,560"
                helper="+15.6% from last month"
                tone="mint"
                icon={CircleDollarSign}
            />
            <BillingMetricCard
                label="Pending amount"
                value="$3,280"
                helper="12 invoices pending"
                tone="amber"
                icon={Clock}
            />
            <BillingMetricCard
                label="Overdue amount"
                value="$1,120"
                helper="3 invoices overdue"
                tone="rose"
                icon={AlertTriangle}
            />
            <BillingMetricCard
                label="Total invoices"
                value="48"
                helper="This billing period"
                tone="blue"
                icon={ReceiptText}
            />
        </section>
    );
}
