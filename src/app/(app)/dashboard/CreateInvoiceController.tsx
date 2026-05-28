"use client";

import Modal from "@/components/ui/Modal";

interface CreateInvoiceControllerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateInvoiceController({ isOpen, onClose }: CreateInvoiceControllerProps) {
    return (
        <Modal
            isOpen={isOpen}
            title="Create invoice"
            description="Prepare a manual invoice for a client and track its payment status."
            onClose={onClose}
        >
            <div className="rounded-2xl bg-cloud-white px-4 py-3 text-sm font-bold text-slate-gray">
                Invoice inputs are not available for this action yet.
            </div>
        </Modal>
    );
}
