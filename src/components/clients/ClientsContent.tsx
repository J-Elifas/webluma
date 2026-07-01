"use client";

import { UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ClientFilters, ClientRow, ClientTableData } from "@/server/clients/types";
import ClientMetricCards from "./ClientMetricCards";
import ClientsPanel from "./ClientsPanel";

interface ClientsContentProps {
    clientFilters: ClientFilters;
    clientSearchQuery: string;
    clientTableData: ClientTableData;
    filteredClientTableData: ClientTableData;
    isGuest: boolean;
    onAddClient: () => void;
    onClientEdit: (client: ClientRow) => void;
    onClientExport: () => void;
    onClientFiltersChange: (filters: ClientFilters) => void;
    onClientPageChange: (page: number) => void;
    onClientSearchQueryChange: (query: string) => void;
}

export default function ClientsContent({
    clientFilters,
    clientSearchQuery,
    clientTableData,
    filteredClientTableData,
    isGuest,
    onAddClient,
    onClientEdit,
    onClientExport,
    onClientFiltersChange,
    onClientPageChange,
    onClientSearchQueryChange,
}: ClientsContentProps) {
    return (
        <>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <SectionHeading
                    title="Clients"
                    subtitle="Manage your clients and their business relationships."
                />
                <Button
                    variant="dark"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={isGuest}
                    onClick={onAddClient}
                    leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
                >
                    Add Client
                </Button>
            </section>

            <ClientMetricCards clients={clientTableData.clients} />

            <ClientsPanel
                clientFilters={clientFilters}
                clientSearchQuery={clientSearchQuery}
                tableData={filteredClientTableData}
                onClientEdit={onClientEdit}
                onClientExport={onClientExport}
                onClientFiltersChange={onClientFiltersChange}
                onClientPageChange={onClientPageChange}
                onClientSearchQueryChange={onClientSearchQueryChange}
            />
        </>
    );
}
