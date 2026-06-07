"use client";

import { Download, MoreVertical } from "lucide-react";
import DataTable, { TablePagination, TableSearch } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
    InvoiceClient,
    InvoiceStatusTone,
} from "@/server/invoices/types";
import BillingInvoiceFilter from "./BillingInvoiceFilter";

interface InvoiceStatusPillProps {
    children: string;
    tone: InvoiceStatusTone;
}

interface BillingInvoicesPanelProps {
    invoiceClients: InvoiceClient[];
    invoiceFilters: BillingInvoiceFilters;
    invoiceSearchQuery: string;
    tableData: BillingInvoiceTableData;
    onInvoiceFiltersChange: (filters: BillingInvoiceFilters) => void;
    onInvoiceSearchQueryChange: (query: string) => void;
    onInvoiceAction: (invoice: BillingInvoiceRow) => void;
}

const statusClasses: Record<InvoiceStatusTone, string> = {
    overdue: "bg-rose-100 text-rose-600",
    paid: "bg-soft-mint/50 text-teal-700",
    pending: "bg-amber-100 text-amber-700",
};

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

export default function BillingInvoicesPanel({
    invoiceClients,
    invoiceFilters,
    invoiceSearchQuery,
    onInvoiceAction,
    onInvoiceFiltersChange,
    onInvoiceSearchQueryChange,
    tableData,
}: BillingInvoicesPanelProps) {
    const { currentPage, invoices, pageSize, totalInvoices, totalPages } = tableData;

    return (
        <DataTable
            toolbar={
                <>
                    <div className="flex flex-wrap gap-3">
                        <TableSearch
                            label="Search invoices"
                            value={invoiceSearchQuery}
                            placeholder="Search invoices or clients..."
                            onValueChange={onInvoiceSearchQueryChange}
                        />
                        <BillingInvoiceFilter
                            clients={invoiceClients}
                            filters={invoiceFilters}
                            onFiltersChange={onInvoiceFiltersChange}
                        />
                    </div>

                    <span className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-4 text-sm font-semibold text-midnight-slate shadow-sm">
                        <Download className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                        Export
                    </span>
                </>
            }
            pagination={
                <TablePagination
                    currentPage={currentPage}
                    itemLabel="invoices"
                    pageSize={pageSize}
                    renderedItemCount={invoices.length}
                    totalItems={totalInvoices}
                    totalPages={totalPages}
                />
            }
        >
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
                {invoices.length > 0 ? (
                    invoices.map((invoice) => {
                        const isPaid = invoice.status === "paid";

                        return (
                            <tr key={invoice.id}>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-midnight-slate">
                                    {invoice.invoiceNumber}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                    {invoice.clientName}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                    {invoice.billingPeriod}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                    {invoice.amount}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                    {invoice.dueDate}
                                </td>
                                <td className="px-4 py-4">
                                    <InvoiceStatusPill tone={invoice.status}>
                                        {invoice.statusLabel}
                                    </InvoiceStatusPill>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            aria-haspopup="dialog"
                                            aria-label={
                                                isPaid
                                                    ? `View payment for ${invoice.invoiceNumber}`
                                                    : `Mark ${invoice.invoiceNumber} as paid`
                                            }
                                            onClick={() => onInvoiceAction(invoice)}
                                            className={cn(
                                                "h-9 min-w-20 rounded-xl px-2 text-xs font-semibold hover:ring-1 hover:ring-luma-blue/20 focus:ring-2 focus:ring-luma-blue/40",
                                                isPaid &&
                                                    "border-soft-mint/80 bg-soft-mint/45 text-teal-700 hover:bg-soft-mint/60"
                                            )}
                                        >
                                            {invoice.actionLabel}
                                        </Button>
                                        <MoreVertical
                                            className="h-4 w-4 text-slate-gray"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td
                            colSpan={7}
                            className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray"
                        >
                            No invoices found.
                        </td>
                    </tr>
                )}
            </tbody>
        </DataTable>
    );
}
