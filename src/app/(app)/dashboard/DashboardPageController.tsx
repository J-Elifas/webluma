"use client";

import { useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { QuickActionId } from "@/components/dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { DashboardInvoiceClientOption, DashboardOverview } from "@/server/dashboard/types";
import AddClientController from "./AddClientController";
import CreateInvoiceController from "./CreateInvoiceController";
import ViewBillingController from "./ViewBillingController";

interface DashboardPageControllerProps {
    overview: DashboardOverview;
    invoiceClientOptions: DashboardInvoiceClientOption[];
}

export default function DashboardPageController({
    invoiceClientOptions,
    overview,
}: DashboardPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Saving client");
    const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);
    const [renderedAction, setRenderedAction] = useState<QuickActionId | null>(null);

    function handleQuickActionSelect(action: QuickActionId) {
        setRenderedAction(action);
        setActiveAction(action);
    }

    function handleModalClose() {
        setActiveAction(null);
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
            <DashboardContent overview={overview} onQuickActionSelect={handleQuickActionSelect} />

            {renderedAction === "add-client" ? (
                <AddClientController
                    isOpen={activeAction === "add-client"}
                    onClose={handleModalClose}
                    onPendingChange={handleClientPendingChange}
                />
            ) : null}

            {renderedAction === "create-invoice" ? (
                <CreateInvoiceController
                    clients={invoiceClientOptions}
                    isOpen={activeAction === "create-invoice"}
                    onClose={handleModalClose}
                    onPendingChange={handleInvoicePendingChange}
                />
            ) : null}

            {renderedAction === "view-billing" ? (
                <ViewBillingController
                    isOpen={activeAction === "view-billing"}
                    onClose={handleModalClose}
                />
            ) : null}

            <LoadingSpinner isVisible={isLoading} label={loadingLabel} fullscreen />
        </>
    );
}
