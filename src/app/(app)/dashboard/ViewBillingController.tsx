"use client";

import Modal from "@/components/ui/Modal";

interface ViewBillingControllerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewBillingController({ isOpen, onClose }: ViewBillingControllerProps) {
    return (
        <Modal
            isOpen={isOpen}
            title="View billing"
            description="Review invoices, payment status, and recurring revenue from one place."
            onClose={onClose}
        >
            <div className="rounded-2xl bg-cloud-white px-4 py-3 text-sm font-bold text-slate-gray">
                Billing inputs are not available for this action yet.
            </div>
        </Modal>
    );
}
