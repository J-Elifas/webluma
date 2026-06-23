"use client";

import { useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { QuickActionId } from "@/components/dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert from "@/components/ui/StatusAlert";
import useRouteNavigationLoading from "@/hooks/useRouteNavigationLoading";
import useStatusAlert from "@/hooks/useStatusAlert";
import type { DashboardOverview } from "@/server/dashboard/types";
import type { InvoiceClient } from "@/server/invoices/types";
import AddClientController from "../clients/AddClientController";
import CreateInvoiceController from "../invoices/CreateInvoiceController";

interface DashboardPageControllerProps {
    overview: DashboardOverview;
    invoiceClient: InvoiceClient[];
}

export default function DashboardPageController({
    invoiceClient,
    overview,
}: DashboardPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Saving client");
    const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);
    const [renderedAction, setRenderedAction] = useState<QuickActionId | null>(null);
    const handleRouteNavigate = useRouteNavigationLoading();
    const { alert, setAlert, showStatusAlert } = useStatusAlert();

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

    return (
        <>
            <DashboardContent
                overview={overview}
                onQuickActionSelect={handleQuickActionSelect}
                onRouteNavigate={handleRouteNavigate}
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

            {renderedAction === "add-client" ? (
                <AddClientController
                    isOpen={activeAction === "add-client"}
                    onClose={handleModalClose}
                    onAfterClose={() => handleModalAfterClose("add-client")}
                    onPendingChange={handleClientPendingChange}
                    onStatusChange={showStatusAlert}
                />
            ) : null}

            {renderedAction === "create-invoice" ? (
                <CreateInvoiceController
                    clients={invoiceClient}
                    isOpen={activeAction === "create-invoice"}
                    onClose={handleModalClose}
                    onAfterClose={() => handleModalAfterClose("create-invoice")}
                    onPendingChange={handleInvoicePendingChange}
                    onStatusChange={showStatusAlert}
                />
            ) : null}

            <LoadingSpinner isVisible={isLoading} label={loadingLabel} fullscreen />
        </>
    );
}
