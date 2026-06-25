"use client";

import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import useTableExport from "@/hooks/useTableExport";
import type { ClientRow } from "@/server/clients/types";

interface ClientExportStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

const clientExportHeaders = [
    "No",
    "Client",
    "Contact",
    "Email",
    "Status",
    "Total invoiced",
    "Outstanding",
    "Last activity",
] as const;

function getClientExportRows(clients: ClientRow[]) {
    return clients.map((client, index) => [
        index + 1,
        client.clientName,
        client.contactPerson,
        client.email,
        client.statusLabel,
        client.totalInvoiced,
        client.outstanding,
        client.lastActivity,
    ]);
}

export default function useClientExport(
    clients: ClientRow[],
    onStatusChange: (status: ClientExportStatus) => void
) {
    const { handleExport } = useTableExport({
        rows: clients,
        headers: clientExportHeaders,
        getRows: getClientExportRows,
        sheetName: "Clients",
        fileNamePrefix: "Clients",
        onStatusChange,
        errorStatus: {
            tone: "error",
            title: "Export not downloaded",
            message: "Unable to export clients. Please try again.",
        },
    });

    function handleClientExport() {
        return handleExport();
    }

    return {
        handleClientExport,
    };
}
