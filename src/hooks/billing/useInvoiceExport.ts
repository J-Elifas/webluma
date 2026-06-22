"use client";

import type { StatusAlertTone } from "@/components/ui/StatusAlert";
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
    async function handleInvoiceExport() {
        try {
            const XLSX = await import("xlsx");
            const worksheet = XLSX.utils.aoa_to_sheet([
                [...invoiceExportHeaders],
                ...getInvoiceExportRows(invoices),
            ]);
            const workbook = XLSX.utils.book_new();
            const exportDate = new Date().toISOString().slice(0, 10);

            XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
            XLSX.writeFile(workbook, `billing-invoices-${exportDate}.xlsx`, {
                compression: true,
            });
        } catch {
            onStatusChange({
                tone: "error",
                title: "Export not downloaded",
                message: "Unable to export invoices. Please try again.",
            });
        }
    }

    return {
        handleInvoiceExport,
    };
}
