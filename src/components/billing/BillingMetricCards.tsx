import { AlertTriangle, CircleDollarSign, Clock, ReceiptText, type LucideIcon } from "lucide-react";
import { currencyFormatter, formatDateValue } from "@/lib/utils";
import type { BillingInvoiceRow } from "@/server/invoices/types";

type BillingMetricTone = "amber" | "blue" | "mint" | "rose";

interface BillingMetricCardProps {
    helper: string;
    icon: LucideIcon;
    label: string;
    tone: BillingMetricTone;
    value: string;
}

interface BillingMetricCardsProps {
    invoices: BillingInvoiceRow[];
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

function isPaidInvoice(invoice: BillingInvoiceRow) {
    return invoice.status === "paid";
}

function isOverdueInvoice(invoice: BillingInvoiceRow, todayValue: string) {
    return !isPaidInvoice(invoice) && todayValue > invoice.dueDateValue;
}

function getPaidRevenue(invoices: BillingInvoiceRow[]) {
    return invoices.reduce(
        (total, invoice) => total + (isPaidInvoice(invoice) ? invoice.amountValue : 0),
        0
    );
}

function getPendingAmount(invoices: BillingInvoiceRow[], todayValue: string) {
    return invoices.reduce(
        (total, invoice) =>
            total +
            (!isPaidInvoice(invoice) && !isOverdueInvoice(invoice, todayValue)
                ? invoice.amountValue
                : 0),
        0
    );
}

function getOverdueAmount(invoices: BillingInvoiceRow[], todayValue: string) {
    return invoices.reduce(
        (total, invoice) =>
            total + (isOverdueInvoice(invoice, todayValue) ? invoice.amountValue : 0),
        0
    );
}

function getInvoiceCountByStatus(
    invoices: BillingInvoiceRow[],
    status: "paid" | "pending" | "overdue",
    todayValue: string
) {
    return invoices.filter((invoice) => {
        if (status === "paid") {
            return isPaidInvoice(invoice);
        }

        if (status === "overdue") {
            return isOverdueInvoice(invoice, todayValue);
        }

        return !isPaidInvoice(invoice) && !isOverdueInvoice(invoice, todayValue);
    }).length;
}

function formatInvoiceCount(count: number, label = "invoice") {
    return `${count} ${label}${count === 1 ? "" : "s"}`;
}

export default function BillingMetricCards({ invoices }: BillingMetricCardsProps) {
    const todayValue = formatDateValue(new Date());
    const paidCount = getInvoiceCountByStatus(invoices, "paid", todayValue);
    const pendingCount = getInvoiceCountByStatus(invoices, "pending", todayValue);
    const overdueCount = getInvoiceCountByStatus(invoices, "overdue", todayValue);

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Billing metrics">
            <BillingMetricCard
                label="Paid revenue"
                value={currencyFormatter.format(getPaidRevenue(invoices))}
                helper={formatInvoiceCount(paidCount, "paid invoice")}
                tone="mint"
                icon={CircleDollarSign}
            />
            <BillingMetricCard
                label="Pending amount"
                value={currencyFormatter.format(getPendingAmount(invoices, todayValue))}
                helper={formatInvoiceCount(pendingCount, "pending invoice")}
                tone="amber"
                icon={Clock}
            />
            <BillingMetricCard
                label="Overdue amount"
                value={currencyFormatter.format(getOverdueAmount(invoices, todayValue))}
                helper={formatInvoiceCount(overdueCount, "overdue invoice")}
                tone="rose"
                icon={AlertTriangle}
            />
            <BillingMetricCard
                label="Total invoices"
                value={String(invoices.length)}
                helper={`${formatInvoiceCount(paidCount, "paid invoice")} / ${formatInvoiceCount(
                    pendingCount + overdueCount,
                    "open invoice"
                )}`}
                tone="blue"
                icon={ReceiptText}
            />
        </section>
    );
}
