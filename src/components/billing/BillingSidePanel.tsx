import type { ReactNode } from "react";
import { AlertTriangle, CalendarDays, ExternalLink, type LucideIcon } from "lucide-react";
import type { BillingInvoiceInsights, BillingReminderPreferences } from "@/server/billing/types";
import type { BillingInvoiceRow } from "@/server/invoices/types";
import PaymentRemindersCard from "./PaymentRemindersCard";

type BillingInsightTone = "blue" | "mint" | "rose";

interface BillingInsightItemProps {
    children: ReactNode;
    icon: LucideIcon;
    tone: BillingInsightTone;
}

interface BillingSidePanelProps {
    invoiceInsights: BillingInvoiceInsights;
    nextPaymentReminder: Pick<BillingInvoiceRow, "clientName" | "dueDate" | "invoiceNumber"> | null;
    reminderPreferences: BillingReminderPreferences;
    onManageReminders: () => void;
}

const insightToneClasses: Record<BillingInsightTone, string> = {
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    rose: "bg-rose-100 text-rose-600",
};

function BillingInsightItem({ children, icon: Icon, tone }: BillingInsightItemProps) {
    return (
        <div className="flex gap-3">
            <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${insightToneClasses[tone]}`}
            >
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">{children}</div>
        </div>
    );
}

function getDueThisWeekTitle(count: number) {
    if (count === 0) {
        return "No invoices due this week";
    }

    return `${count} invoice${count === 1 ? "" : "s"} due this week`;
}

function getOverdueTitle(count: number) {
    if (count === 0) {
        return "No overdue invoices require follow-up";
    }

    return `${count} overdue invoice${count === 1 ? "" : "s"} ${count === 1 ? "requires" : "require"
        } follow-up`;
}

function getDueThisWeekHelper({ amount, count, dueByDate }: BillingInvoiceInsights["dueThisWeek"]) {
    if (count === 0) {
        return "No pending invoices are due in the next 7 days.";
    }

    return `${amount} is due by ${dueByDate}`;
}

function getOverdueHelper({ amount, count, daysOverdue }: BillingInvoiceInsights["overdue"]) {
    if (count === 0) {
        return "No pending invoices are past due.";
    }

    return `${amount} is overdue by ${daysOverdue} day${daysOverdue === 1 ? "" : "s"}`;
}

export default function BillingSidePanel({
    invoiceInsights,
    nextPaymentReminder,
    onManageReminders,
    reminderPreferences,
}: BillingSidePanelProps) {
    return (
        <aside className="space-y-4">
            <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-black text-midnight-slate">Billing insights</h2>
                </div>

                <div className="mt-5 space-y-5">
                    <BillingInsightItem icon={CalendarDays} tone="blue">
                        <p className="text-sm font-bold text-midnight-slate">
                            {getDueThisWeekTitle(invoiceInsights.dueThisWeek.count)}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                            {getDueThisWeekHelper(invoiceInsights.dueThisWeek)}
                        </p>
                    </BillingInsightItem>

                    <BillingInsightItem icon={AlertTriangle} tone="rose">
                        <p className="text-sm font-bold text-midnight-slate">
                            {getOverdueTitle(invoiceInsights.overdue.count)}
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                            {getOverdueHelper(invoiceInsights.overdue)}
                        </p>
                    </BillingInsightItem>
                </div>

                <span className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-bold text-midnight-slate shadow-sm">
                    View all reports
                    <ExternalLink className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                </span>
            </article>

            <PaymentRemindersCard
                nextPaymentReminder={nextPaymentReminder}
                preferences={reminderPreferences}
                onManageReminders={onManageReminders}
            />
        </aside>
    );
}
