"use client";

import { useState } from "react";
import type { ClientRow } from "@/server/clients/types";

export default function useClientModals() {
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

    function handleAddClientSelect() {
        setSelectedClient(null);
        setIsClientFormOpen(true);
    }

    function handleEditClientSelect(client: ClientRow) {
        setSelectedClient(client);
        setIsClientFormOpen(true);
    }

    function handleClientFormClose() {
        setIsClientFormOpen(false);
    }

    function handleClientFormAfterClose() {
        setSelectedClient(null);
    }

    return {
        isClientFormOpen,
        selectedClient,
        handleAddClientSelect,
        handleClientFormAfterClose,
        handleClientFormClose,
        handleEditClientSelect,
    };
}
