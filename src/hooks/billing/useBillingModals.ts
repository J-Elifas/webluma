"use client";

import { useState } from "react";
import type { BillingInvoiceRow } from "@/server/invoices/types";

export default function useBillingModals() {
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoiceRow | null>(null);

    function handleCreateInvoiceSelect() {
        setIsCreateInvoiceOpen(true);
    }

    function handleCreateInvoiceClose() {
        setIsCreateInvoiceOpen(false);
    }

    function handleInvoiceActionSelect(invoice: BillingInvoiceRow) {
        setSelectedInvoice(invoice);
        setIsMarkPaidOpen(true);
    }

    function handleMarkInvoicePaidClose() {
        setIsMarkPaidOpen(false);
    }

    function handleMarkInvoicePaidAfterClose() {
        setSelectedInvoice(null);
    }

    return {
        isCreateInvoiceOpen,
        isMarkPaidOpen,
        selectedInvoice,
        handleCreateInvoiceClose,
        handleCreateInvoiceSelect,
        handleInvoiceActionSelect,
        handleMarkInvoicePaidAfterClose,
        handleMarkInvoicePaidClose,
    };
}
