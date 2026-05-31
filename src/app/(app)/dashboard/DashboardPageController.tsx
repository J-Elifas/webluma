"use client";

import { useEffect, useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { QuickActionId } from "@/components/dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert, { type StatusAlertTone } from "@/components/ui/StatusAlert";
import type { DashboardOverview } from "@/server/dashboard/types";
import type { InvoiceClientOption } from "@/server/invoices/types";
import AddClientController from "./AddClientController";
import CreateInvoiceController from "../invoices/CreateInvoiceController";
import ViewBillingController from "./ViewBillingController";

interface DashboardPageControllerProps {
    overview: DashboardOverview;
    invoiceClientOptions: InvoiceClientOption[];
}

interface DashboardAlert {
    id: number;
    tone: StatusAlertTone;
    title: string;
    message: string;
}

export default function DashboardPageController({
    invoiceClientOptions,
    overview,
}: DashboardPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Saving client");
    const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);
    const [renderedAction, setRenderedAction] = useState<QuickActionId | null>(null);
    const [alert, setAlert] = useState<DashboardAlert | null>(null);

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

    function handleQuickActionSelect(action: QuickActionId) {
        setRenderedAction(action);
        setActiveAction(action);
    }

    function handleModalClose() {
        setActiveAction(null);
    }

    function handleModalAfterClose(action: QuickActionId) {
        setRenderedAction((currentAction) => (currentAction === action ? null : currentAction));
    }

    function handleClientPendingChange(isPending: boolean) {
        setLoadingLabel("Saving client");
        setIsLoading(isPending);
    }

    function handleInvoicePendingChange(isPending: boolean) {
        setLoadingLabel("Saving invoice");
        setIsLoading(isPending);
    }

    function handleStatusAlert(nextAlert: Omit<DashboardAlert, "id">) {
        setAlert({
            ...nextAlert,
            id: Date.now(),
        });
    }

    return (
        <>
            <DashboardContent overview={overview} onQuickActionSelect={handleQuickActionSelect} />

            {alert ? (
                <StatusAlert
                    key={alert.id}
                    tone={alert.tone}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                />
            ) : null}

            {renderedAction === "add-client" ? (
                <AddClientController
                    isOpen={activeAction === "add-client"}
                    onClose={handleModalClose}
                    onAfterClose={() => handleModalAfterClose("add-client")}
                    onPendingChange={handleClientPendingChange}
                    onStatusChange={handleStatusAlert}
                />
            ) : null}

            {renderedAction === "create-invoice" ? (
                <CreateInvoiceController
                    clients={invoiceClientOptions}
                    isOpen={activeAction === "create-invoice"}
                    onClose={handleModalClose}
                    onAfterClose={() => handleModalAfterClose("create-invoice")}
                    onPendingChange={handleInvoicePendingChange}
                    onStatusChange={handleStatusAlert}
                />
            ) : null}

            {renderedAction === "view-billing" ? (
                <ViewBillingController
                    isOpen={activeAction === "view-billing"}
                    onClose={handleModalClose}
                    onAfterClose={() => handleModalAfterClose("view-billing")}
                />
            ) : null}

            <LoadingSpinner isVisible={isLoading} label={loadingLabel} fullscreen />
        </>
    );
}
