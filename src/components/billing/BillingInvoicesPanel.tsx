"use client";

import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import DataTable, { TableHeader, TablePagination, TableSearch } from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import StatusAlert, { type StatusAlertTone } from "@/components/ui/StatusAlert";
import useStatusAlert from "@/hooks/useStatusAlert";
import { cn } from "@/lib/utils";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
    DeleteInvoicePaymentMutationResult,
    InvoiceClient,
    InvoiceStatusTone,
} from "@/server/invoices/types";
import BillingInvoiceFilter from "./BillingInvoiceFilter";
import PaidInvoiceActions from "./PaidInvoiceActions";

interface InvoiceStatusPillProps {
    children: string;
    tone: InvoiceStatusTone;
}

interface BillingInvoicesPanelProps {
    invoiceClients: InvoiceClient[];
    invoiceFilters: BillingInvoiceFilters;
    invoiceSearchQuery: string;
    tableData: BillingInvoiceTableData;
    onInvoiceExport: () => void;
    onInvoiceFiltersChange: (filters: BillingInvoiceFilters) => void;
    onInvoicePageChange: (page: number) => void;
    onInvoiceSearchQueryChange: (query: string) => void;
    onInvoiceAction: (invoice: BillingInvoiceRow) => void;
}

interface InvoicePaymentDeleteStatus {
    message: string;
    title: string;
    tone: StatusAlertTone;
}

const statusClasses: Record<InvoiceStatusTone, string> = {
    overdue: "bg-rose-100 text-rose-600",
    paid: "bg-soft-mint/50 text-teal-700",
    pending: "bg-amber-100 text-amber-700",
};
const deletePaymentErrorMessage = "Unable to delete paid status. Please try again.";
const deletePaymentSuccessMessage = "Invoice payment details were cleared.";
const invoiceTableColumns = [
    { label: "No", className: "w-16" },
    { label: "Invoice" },
    { label: "Client" },
    { label: "Billing period" },
    { label: "Amount" },
    { label: "Due date" },
    { label: "Status" },
    { label: "Actions" },
] as const;

async function readDeleteInvoicePaymentResponse(
    response: Response
): Promise<DeleteInvoicePaymentMutationResult> {
    try {
        return (await response.json()) as DeleteInvoicePaymentMutationResult;
    } catch {
        return {
            ok: false,
        };
    }
}

function isDeletePaymentSuccessful(
    response: Response,
    result: DeleteInvoicePaymentMutationResult
): boolean {
    return response.ok && result.ok;
}

function getDeletePaymentFailure(
    response: Response,
    result: DeleteInvoicePaymentMutationResult
): DeleteInvoicePaymentMutationResult | null {
    if (isDeletePaymentSuccessful(response, result)) {
        return null;
    }

    return {
        message: result.message ?? deletePaymentErrorMessage,
        ok: false,
    };
}

async function deleteInvoicePaymentStatus(
    invoiceId: string
): Promise<DeleteInvoicePaymentMutationResult> {
    try {
        const response = await fetch("/api/invoices", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                invoiceId,
            }),
        });
        const result = await readDeleteInvoicePaymentResponse(response);
        const failure = getDeletePaymentFailure(response, result);

        if (failure) {
            return failure;
        }

        return {
            ...result,
            message: result.message ?? deletePaymentSuccessMessage,
        };
    } catch {
        return {
            message: deletePaymentErrorMessage,
            ok: false,
        };
    }
}

function getDeletePaymentStatus(
    result: DeleteInvoicePaymentMutationResult
): InvoicePaymentDeleteStatus {
    if (result.ok) {
        return {
            tone: "success",
            title: "Paid status deleted",
            message: result.message ?? deletePaymentSuccessMessage,
        };
    }

    return {
        tone: "error",
        title: "Paid status not deleted",
        message: result.message ?? deletePaymentErrorMessage,
    };
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

export default function BillingInvoicesPanel({
    invoiceClients,
    invoiceFilters,
    invoiceSearchQuery,
    onInvoiceAction,
    onInvoiceExport,
    onInvoiceFiltersChange,
    onInvoicePageChange,
    onInvoiceSearchQueryChange,
    tableData,
}: BillingInvoicesPanelProps) {
    const router = useRouter();
    const { currentPage, invoices, pageSize, totalInvoices, totalPages } = tableData;
    const rowNumberOffset = (currentPage - 1) * pageSize;
    const { alert, setAlert, showStatusAlert } = useStatusAlert();

    async function handleDeletePayment(invoiceId: string) {
        const result = await deleteInvoicePaymentStatus(invoiceId);

        showStatusAlert(getDeletePaymentStatus(result));

        if (result.ok) {
            router.refresh();
        }

        return result.ok;
    }

    return (
        <>
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

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            aria-label="Export invoices"
                            disabled={totalInvoices === 0}
                            onClick={onInvoiceExport}
                            className="w-full min-w-[8.5rem] rounded-xl px-3 font-semibold transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-luma-blue/25 sm:w-auto"
                            leftIcon={
                                <Download
                                    className="h-4 w-4 text-slate-gray"
                                    aria-hidden="true"
                                />
                            }
                        >
                            Export
                        </Button>
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
                        onPageChange={onInvoicePageChange}
                    />
                }
            >
                <TableHeader columns={invoiceTableColumns} />
                <tbody className="divide-y divide-mist-gray/60">
                    {invoices.length > 0 ? (
                        invoices.map((invoice, index) => {
                            const isPaid = invoice.status === "paid";

                            return (
                                <tr key={invoice.id}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-gray">
                                        {rowNumberOffset + index + 1}
                                    </td>
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
                                                variant="secondary"
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
                                            {isPaid ? (
                                                <PaidInvoiceActions
                                                    invoiceNumber={invoice.invoiceNumber}
                                                    onDelete={() => handleDeletePayment(invoice.id)}
                                                />
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={8}
                                className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray"
                            >
                                No invoices found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </DataTable>

            {alert ? (
                <StatusAlert
                    key={alert.id}
                    tone={alert.tone}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                />
            ) : null}
        </>
    );
}
