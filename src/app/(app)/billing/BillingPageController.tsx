"use client";

import { useEffect, useMemo, useState } from "react";
import BillingContent from "@/components/billing/BillingContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert, { type StatusAlertTone } from "@/components/ui/StatusAlert";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
    InvoiceClient,
} from "@/server/invoices/types";
import MarkInvoicePaidController from "./MarkInvoicePaidController";
import CreateInvoiceController from "../invoices/CreateInvoiceController";

interface BillingPageControllerProps {
    invoiceClient: InvoiceClient[];
    invoiceTableData: BillingInvoiceTableData;
    isGuest: boolean;
}

interface BillingInvoiceAlert {
    id: number;
    tone: StatusAlertTone;
    title: string;
    message: string;
}

const defaultBillingInvoiceFilters: BillingInvoiceFilters = {
    status: "all",
    clientId: "all",
    dueDateStart: "",
    dueDateEnd: "",
};

function getFilteredInvoiceTableData(
    tableData: BillingInvoiceTableData,
    filters: BillingInvoiceFilters
): BillingInvoiceTableData {
    const filteredInvoices = tableData.invoices.filter((invoice) => {
        if (filters.status !== "all" && invoice.status !== filters.status) {
            return false;
        }

        if (filters.clientId !== "all" && invoice.clientId !== filters.clientId) {
            return false;
        }

        if (filters.dueDateStart && invoice.dueDateValue < filters.dueDateStart) {
            return false;
        }

        if (filters.dueDateEnd && invoice.dueDateValue > filters.dueDateEnd) {
            return false;
        }

        return true;
    });

    return {
        ...tableData,
        invoices: filteredInvoices,
        currentPage: 1,
        totalInvoices: filteredInvoices.length,
        totalPages: Math.max(1, Math.ceil(filteredInvoices.length / tableData.pageSize)),
    };
}

export default function BillingPageController({
    invoiceClient,
    invoiceTableData,
    isGuest,
}: BillingPageControllerProps) {
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoiceRow | null>(null);
    const [invoiceFilters, setInvoiceFilters] = useState(defaultBillingInvoiceFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<BillingInvoiceAlert | null>(null);
    const filteredInvoiceTableData = useMemo(
        () => getFilteredInvoiceTableData(invoiceTableData, invoiceFilters),
        [invoiceFilters, invoiceTableData]
    );

    useEffect(() => {
        if (!alert) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setAlert(null);
        }, 6000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [alert]);

    function handleCreateInvoiceSelect() {
        setIsCreateInvoiceOpen(true);
    }

    function handleInvoiceActionSelect(invoice: BillingInvoiceRow) {
        setSelectedInvoice(invoice);
        setIsMarkPaidOpen(true);
    }

    function handleMarkInvoicePaidAfterClose() {
        setSelectedInvoice(null);
    }

    function handleStatusAlert(nextAlert: Omit<BillingInvoiceAlert, "id">) {
        setAlert({
            ...nextAlert,
            id: Date.now(),
        });
    }

    return (
        <>
            <BillingContent
                filteredInvoiceTableData={filteredInvoiceTableData}
                invoiceClients={invoiceClient}
                invoiceFilters={invoiceFilters}
                invoiceTableData={invoiceTableData}
                isGuest={isGuest}
                onCreateInvoice={handleCreateInvoiceSelect}
                onInvoiceAction={handleInvoiceActionSelect}
                onInvoiceFiltersChange={setInvoiceFilters}
            />

            {alert ? (
                <StatusAlert
                    key={alert.id}
                    tone={alert.tone}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                />
            ) : null}

            <CreateInvoiceController
                clients={invoiceClient}
                isOpen={isCreateInvoiceOpen}
                onClose={() => setIsCreateInvoiceOpen(false)}
                onPendingChange={setIsLoading}
                onStatusChange={handleStatusAlert}
            />

            <MarkInvoicePaidController
                key={selectedInvoice?.id ?? "invoice-payment"}
                invoice={selectedInvoice}
                isOpen={isMarkPaidOpen}
                onClose={() => setIsMarkPaidOpen(false)}
                onAfterClose={handleMarkInvoicePaidAfterClose}
                onPendingChange={setIsLoading}
                onStatusChange={handleStatusAlert}
            />

            <LoadingSpinner isVisible={isLoading} label="Saving invoice" fullscreen />
        </>
    );
}
