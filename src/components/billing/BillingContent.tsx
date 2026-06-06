"use client";

import { FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
    InvoiceClient,
} from "@/server/invoices/types";
import BillingInvoicesPanel from "./BillingInvoicesPanel";
import BillingMetricCards from "./BillingMetricCards";
import BillingSidePanel from "./BillingSidePanel";

interface BillingContentProps {
    filteredInvoiceTableData: BillingInvoiceTableData;
    invoiceClients: InvoiceClient[];
    invoiceFilters: BillingInvoiceFilters;
    invoiceTableData: BillingInvoiceTableData;
    isGuest: boolean;
    onCreateInvoice: () => void;
    onInvoiceFiltersChange: (filters: BillingInvoiceFilters) => void;
    onInvoiceAction: (invoice: BillingInvoiceRow) => void;
}

export default function BillingContent({
    filteredInvoiceTableData,
    invoiceClients,
    invoiceFilters,
    invoiceTableData,
    isGuest,
    onCreateInvoice,
    onInvoiceAction,
    onInvoiceFiltersChange,
}: BillingContentProps) {
    return (
        <>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <SectionHeading
                    title="Billing"
                    subtitle="Track invoices, payment status, and recurring revenue."
                />
                <Button
                    variant="dark"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={isGuest}
                    onClick={onCreateInvoice}
                    leftIcon={<FileText className="h-4 w-4" aria-hidden="true" />}
                >
                    Create Invoice
                </Button>
            </section>

            <BillingMetricCards invoices={invoiceTableData.invoices} />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <BillingInvoicesPanel
                    invoiceClients={invoiceClients}
                    invoiceFilters={invoiceFilters}
                    tableData={filteredInvoiceTableData}
                    onInvoiceFiltersChange={onInvoiceFiltersChange}
                    onInvoiceAction={onInvoiceAction}
                />
                <BillingSidePanel />
            </section>
        </>
    );
}
