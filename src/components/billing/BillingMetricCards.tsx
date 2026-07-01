import { AlertTriangle, CircleDollarSign, Clock, ReceiptText } from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import { currencyFormatter, formatDateValue } from "@/lib/utils";
import type { BillingInvoiceRow } from "@/server/invoices/types";

interface BillingMetricCardsProps {
    invoices: BillingInvoiceRow[];
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
            <MetricCard
                label="Paid revenue"
                value={currencyFormatter.format(getPaidRevenue(invoices))}
                helper={formatInvoiceCount(paidCount, "paid invoice")}
                tone="mint"
                icon={CircleDollarSign}
            />
            <MetricCard
                label="Pending amount"
                value={currencyFormatter.format(getPendingAmount(invoices, todayValue))}
                helper={formatInvoiceCount(pendingCount, "pending invoice")}
                tone="amber"
                icon={Clock}
            />
            <MetricCard
                label="Overdue amount"
                value={currencyFormatter.format(getOverdueAmount(invoices, todayValue))}
                helper={formatInvoiceCount(overdueCount, "overdue invoice")}
                tone="rose"
                icon={AlertTriangle}
            />
            <MetricCard
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
