"use client";

import { useEffect, useState } from "react";
import BillingContent from "@/components/billing/BillingContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert, { type StatusAlertTone } from "@/components/ui/StatusAlert";
import type { BillingInvoiceTableData, InvoiceClient } from "@/server/invoices/types";
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

export default function BillingPageController({
    invoiceClient,
    invoiceTableData,
    isGuest,
}: BillingPageControllerProps) {
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<BillingInvoiceAlert | null>(null);

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

    function handleStatusAlert(nextAlert: Omit<BillingInvoiceAlert, "id">) {
        setAlert({
            ...nextAlert,
            id: Date.now(),
        });
    }

    return (
        <>
            <BillingContent
                invoiceTableData={invoiceTableData}
                isGuest={isGuest}
                onCreateInvoice={handleCreateInvoiceSelect}
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

            <LoadingSpinner isVisible={isLoading} label="Saving invoice" fullscreen />
        </>
    );
}
