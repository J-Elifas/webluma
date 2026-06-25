"use client";

import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import useTableExport from "@/hooks/useTableExport";
import type { BillingInvoiceRow } from "@/server/invoices/types";

interface InvoiceExportStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

const invoiceExportHeaders = [
    "No",
    "Invoice",
    "Client",
    "Billing period",
    "Amount",
    "Due date",
    "Status",
] as const;

function getInvoiceExportRows(invoices: BillingInvoiceRow[]) {
    return invoices.map((invoice, index) => [
        index + 1,
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.billingPeriod,
        invoice.amount,
        invoice.dueDate,
        invoice.statusLabel,
    ]);
}

export default function useInvoiceExport(
    invoices: BillingInvoiceRow[],
    onStatusChange: (status: InvoiceExportStatus) => void
) {
    const { handleExport } = useTableExport({
        rows: invoices,
        headers: invoiceExportHeaders,
        getRows: getInvoiceExportRows,
        sheetName: "Invoices",
        fileNamePrefix: "billing-invoices",
        onStatusChange,
        errorStatus: {
            tone: "error",
            title: "Export not downloaded",
            message: "Unable to export invoices. Please try again.",
        },
    });

    function handleInvoiceExport() {
        return handleExport();
    }

    return {
        handleInvoiceExport,
    };
}
