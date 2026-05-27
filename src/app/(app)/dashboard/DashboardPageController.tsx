"use client";

import { useMemo, useState } from "react";
import AddClientForm from "@/components/dashboard/AddClientForm";
import DashboardContent from "@/components/dashboard/DashboardContent";
import type { QuickActionId } from "@/components/dashboard/QuickActionsCard";
import Modal from "@/components/ui/Modal";
import type { DashboardOverview } from "@/server/dashboard/types";

interface DashboardPageControllerProps {
    overview: DashboardOverview;
}

const actionCopy: Record<QuickActionId, { title: string; description: string }> = {
    "add-client": {
        title: "Add client",
        description: "Create a new client profile with contact and plan details.",
    },
    "create-invoice": {
        title: "Create invoice",
        description: "Prepare a manual invoice for a client and track its payment status.",
    },
    "view-billing": {
        title: "View billing",
        description: "Review invoices, payment status, and recurring revenue from one place.",
    },
};

export default function DashboardPageController({ overview }: DashboardPageControllerProps) {
    const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);
    const [renderedAction, setRenderedAction] = useState<QuickActionId | null>(null);

    const modalCopy = useMemo(() => {
        if (!renderedAction) {
            return null;
        }

        return actionCopy[renderedAction];
    }, [renderedAction]);

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
            <Modal
                isOpen={activeAction !== null}
                title={modalCopy?.title ?? ""}
                description={modalCopy?.description}
                size={renderedAction === "add-client" ? "lg" : "md"}
                onClose={handleModalClose}
            >
                {renderedAction === "add-client" ? (
                    <AddClientForm onCancel={handleModalClose} />
                ) : (
                    <div className="rounded-2xl bg-cloud-white px-4 py-3 text-sm font-bold text-slate-gray">
                        Form inputs are not available for this action yet.
                    </div>
                )}
            </Modal>
        </>
    );
}
