"use client";

import { useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { QuickActionId } from "@/components/dashboard/QuickActionsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { DashboardOverview } from "@/server/dashboard/types";
import AddClientController from "./AddClientController";
import CreateInvoiceController from "./CreateInvoiceController";
import ViewBillingController from "./ViewBillingController";

interface DashboardPageControllerProps {
    overview: DashboardOverview;
}

export default function DashboardPageController({ overview }: DashboardPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);
    const [renderedAction, setRenderedAction] = useState<QuickActionId | null>(null);

    function handleQuickActionSelect(action: QuickActionId) {
        setRenderedAction(action);
        setActiveAction(action);
    }

    function handleModalClose() {
        setActiveAction(null);
    }

    return (
        <>
            <DashboardContent overview={overview} onQuickActionSelect={handleQuickActionSelect} />

            {renderedAction === "add-client" ? (
                <AddClientController
                    isOpen={activeAction === "add-client"}
                    onClose={handleModalClose}
                    onPendingChange={setIsLoading}
                />
            ) : null}

            {renderedAction === "create-invoice" ? (
                <CreateInvoiceController
                    isOpen={activeAction === "create-invoice"}
                    onClose={handleModalClose}
                />
            ) : null}

            {renderedAction === "view-billing" ? (
                <ViewBillingController
                    isOpen={activeAction === "view-billing"}
                    onClose={handleModalClose}
                />
            ) : null}

            <LoadingSpinner isVisible={isLoading} label="Saving client" fullscreen />
        </>
    );
}
