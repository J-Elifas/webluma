"use client";

import { useState } from "react";
import ClientsContent from "@/components/clients/ClientsContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert from "@/components/ui/StatusAlert";
import useClientExport from "@/hooks/clients/useClientExport";
import useClientFilters from "@/hooks/clients/useClientFilters";
import useClientModals from "@/hooks/clients/useClientModals";
import useStatusAlert from "@/hooks/useStatusAlert";
import type { ClientTableData } from "@/server/clients/types";
import AddClientController from "./AddClientController";

interface ClientPageControllerProps {
    clientTableData: ClientTableData;
    isGuest: boolean;
}

export default function ClientPageController({
    clientTableData,
    isGuest,
}: ClientPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { alert, setAlert, showStatusAlert } = useStatusAlert();
    const clientFilters = useClientFilters(clientTableData);
    const clientModals = useClientModals();
    const clientExport = useClientExport(clientFilters.filteredClients, showStatusAlert);

    return (
        <>
            <ClientsContent
                clientFilters={clientFilters.clientFilters}
                clientSearchQuery={clientFilters.clientSearchQuery}
                clientTableData={clientTableData}
                filteredClientTableData={clientFilters.filteredClientTableData}
                isGuest={isGuest}
                onAddClient={clientModals.handleAddClientSelect}
                onClientExport={clientExport.handleClientExport}
                onClientFiltersChange={clientFilters.handleClientFiltersChange}
                onClientPageChange={clientFilters.handleClientPageChange}
                onClientSearchQueryChange={clientFilters.handleClientSearchQueryChange}
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

            <AddClientController
                isOpen={clientModals.isAddClientOpen}
                onClose={clientModals.handleAddClientClose}
                onPendingChange={setIsLoading}
                onStatusChange={showStatusAlert}
            />

            <LoadingSpinner isVisible={isLoading} label="Saving client" fullscreen />
        </>
    );
}
