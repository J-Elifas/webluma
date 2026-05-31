import type { ReactNode } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    MoreVertical,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type InvoiceStatusTone = "paid" | "pending" | "overdue";

interface InvoiceStatusPillProps {
    children: string;
    tone: InvoiceStatusTone;
}

const statusClasses: Record<InvoiceStatusTone, string> = {
    overdue: "bg-rose-100 text-rose-600",
    paid: "bg-soft-mint/50 text-teal-700",
    pending: "bg-amber-100 text-amber-700",
};

function FilterChip({ children, icon }: { children: string; icon?: ReactNode }) {
    return (
        <span className="inline-flex h-10 min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-semibold text-midnight-slate shadow-sm sm:flex-none">
            {icon}
            <span className="truncate">{children}</span>
            <ChevronDown className="h-4 w-4 text-slate-gray" aria-hidden="true" />
        </span>
    );
}

function InvoiceStatusPill({ children, tone }: InvoiceStatusPillProps) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                statusClasses[tone]
            )}
        >
            {children}
        </span>
    );
}

function InvoiceAction({ children }: { children: string }) {
    return (
        <span className="inline-flex h-9 min-w-16 items-center justify-center rounded-xl border border-mist-gray/70 bg-white px-3 text-xs font-semibold text-midnight-slate shadow-sm">
            {children}
        </span>
    );
}

export default function BillingInvoicesPanel() {
    return (
        <article className="min-w-0 overflow-hidden rounded-[1.25rem] border border-mist-gray/70 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <div className="grid gap-3 border-b border-mist-gray/70 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex flex-wrap gap-3">
                    <div
                        className="flex h-10 min-w-[min(100%,16rem)] flex-1 items-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-semibold text-slate-gray shadow-sm"
                        role="search"
                        aria-label="Invoice search preview"
                    >
                        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">Search invoices or clients...</span>
                    </div>

                    <FilterChip>Status: All</FilterChip>
                    <FilterChip>Client: All</FilterChip>
                    <FilterChip
                        icon={
                            <CalendarDays className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                        }
                    >
                        This Month
                    </FilterChip>
                </div>

                <span className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-4 text-sm font-semibold text-midnight-slate shadow-sm">
                    <Download className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                    Export
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left">
                    <thead>
                        <tr className="bg-cloud-white/80 text-xs font-bold uppercase text-slate-gray">
                            <th className="px-4 py-3">Invoice</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Billing period</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Due date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-mist-gray/60">
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-midnight-slate">
                                INV-001
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                Acme Studio
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                May 29, 2026 - Jun 28, 2026
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                $99.00
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                Jun 4, 2026
                            </td>
                            <td className="px-4 py-4">
                                <InvoiceStatusPill tone="paid">Paid</InvoiceStatusPill>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <InvoiceAction>View</InvoiceAction>
                                    <MoreVertical
                                        className="h-4 w-4 text-slate-gray"
                                        aria-hidden="true"
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-midnight-slate">
                                INV-002
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                Nova Creative
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                May 29, 2026 - Jun 28, 2026
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                $299.00
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                Jun 4, 2026
                            </td>
                            <td className="px-4 py-4">
                                <InvoiceStatusPill tone="pending">Pending</InvoiceStatusPill>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <InvoiceAction>Mark paid</InvoiceAction>
                                    <MoreVertical
                                        className="h-4 w-4 text-slate-gray"
                                        aria-hidden="true"
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-mist-gray/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-gray">
                    Showing 1 to 8 of 48 invoices
                </p>
                <div className="flex items-center gap-2" aria-label="Pagination preview">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm">
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-luma-blue text-sm font-black text-white shadow-[0_14px_24px_-18px_rgba(56,189,248,0.9)]">
                        1
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-sm font-black text-midnight-slate shadow-sm">
                        2
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-sm font-black text-midnight-slate shadow-sm">
                        3
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center text-sm font-black text-slate-gray">
                        ...
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-sm font-black text-midnight-slate shadow-sm">
                        6
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm">
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                </div>
            </div>
        </article>
    );
}
