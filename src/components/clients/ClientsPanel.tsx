"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import DataTable, { TableHeader, TablePagination, TableSearch } from "@/components/ui/DataTable";
import StatusAlert from "@/components/ui/StatusAlert";
import useStatusAlert from "@/hooks/useStatusAlert";
import { cn } from "@/lib/utils";
import type {
    ClientFilters,
    ClientRow,
    ClientStatusTone,
    ClientTableData,
    DeleteClientMutationResult,
} from "@/server/clients/types";
import ClientActions from "./ClientActions";
import ClientFilter from "./ClientFilter";

interface ClientsPanelProps {
    clientFilters: ClientFilters;
    clientSearchQuery: string;
    tableData: ClientTableData;
    onClientEdit: (client: ClientRow) => void;
    onClientExport: () => void;
    onClientFiltersChange: (filters: ClientFilters) => void;
    onClientPageChange: (page: number) => void;
    onClientSearchQueryChange: (query: string) => void;
}

const statusClasses: Record<ClientStatusTone, string> = {
    active: "bg-soft-mint/50 text-teal-700",
    inactive: "bg-slate-100 text-slate-600",
    lead: "bg-luma-blue/10 text-luma-blue",
};
const deleteClientErrorMessage = "Unable to delete client. Please try again.";
const deleteClientSuccessMessage = "Client was deleted.";
const clientTableColumns = [
    { label: "No", className: "w-16" },
    { label: "Client" },
    { label: "Contact" },
    { label: "Email" },
    { label: "Status" },
    { label: "Plan" },
    { label: "Total invoiced" },
    { label: "Outstanding" },
    { label: "Last activity" },
    { label: "Actions" },
] as const;

async function readDeleteClientResponse(response: Response): Promise<DeleteClientMutationResult> {
    try {
        return (await response.json()) as DeleteClientMutationResult;
    } catch {
        return {
            ok: false,
        };
    }
}

function isDeleteClientSuccessful(response: Response, result: DeleteClientMutationResult): boolean {
    return response.ok && result.ok;
}

function getDeleteClientFailure(
    response: Response,
    result: DeleteClientMutationResult
): DeleteClientMutationResult | null {
    if (isDeleteClientSuccessful(response, result)) {
        return null;
    }

    return {
        message: result.message ?? deleteClientErrorMessage,
        ok: false,
    };
}

async function deleteClientRecord(clientId: string): Promise<DeleteClientMutationResult> {
    try {
        const response = await fetch("/api/clients", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clientId,
            }),
        });
        const result = await readDeleteClientResponse(response);
        const failure = getDeleteClientFailure(response, result);

        if (failure) {
            return failure;
        }

        return {
            ...result,
            message: result.message ?? deleteClientSuccessMessage,
        };
    } catch {
        return {
            message: deleteClientErrorMessage,
            ok: false,
        };
    }
}

function getDeleteClientStatus(result: DeleteClientMutationResult) {
    if (result.ok) {
        return {
            tone: "success" as const,
            title: "Client deleted",
            message: result.message ?? deleteClientSuccessMessage,
        };
    }

    return {
        tone: "error" as const,
        title: "Client not deleted",
        message: result.message ?? deleteClientErrorMessage,
    };
}

function ClientStatusPill({ children, tone }: { children: string; tone: ClientStatusTone }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                statusClasses[tone]
            )}
        >
            {children}
        </span>
    );
}

export default function ClientsPanel({
    clientFilters,
    clientSearchQuery,
    onClientEdit,
    onClientExport,
    onClientFiltersChange,
    onClientPageChange,
    onClientSearchQueryChange,
    tableData,
}: ClientsPanelProps) {
    const router = useRouter();
    const { alert, setAlert, showStatusAlert } = useStatusAlert();
    const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
    const { clients, currentPage, pageSize, totalClients, totalPages } = tableData;
    const rowNumberOffset = (currentPage - 1) * pageSize;

    async function handleDeleteClient(clientId: string) {
        if (deletingClientId) {
            return;
        }

        setDeletingClientId(clientId);

        const result = await deleteClientRecord(clientId);

        showStatusAlert(getDeleteClientStatus(result));
        setDeletingClientId(null);

        if (result.ok) {
            router.refresh();
        }
    }

    return (
        <>
            <DataTable
                toolbar={
                    <>
                        <div className="flex flex-wrap gap-3">
                            <TableSearch
                                label="Search clients"
                                value={clientSearchQuery}
                                placeholder="Search clients..."
                                onValueChange={onClientSearchQueryChange}
                            />
                            <ClientFilter
                                filters={clientFilters}
                                onFiltersChange={onClientFiltersChange}
                            />
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            aria-label="Export clients"
                            disabled={totalClients === 0}
                            onClick={onClientExport}
                            className="w-full min-w-[8.5rem] rounded-xl px-3 font-semibold transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-luma-blue/25 sm:w-auto"
                            leftIcon={
                                <Download className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                            }
                        >
                            Export
                        </Button>
                    </>
                }
                pagination={
                    <TablePagination
                        currentPage={currentPage}
                        itemLabel="clients"
                        pageSize={pageSize}
                        renderedItemCount={clients.length}
                        totalItems={totalClients}
                        totalPages={totalPages}
                        onPageChange={onClientPageChange}
                    />
                }
            >
                <TableHeader columns={clientTableColumns} />
                <tbody className="divide-y divide-mist-gray/60">
                    {clients.length > 0 ? (
                        clients.map((client, index) => (
                            <tr key={client.id}>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-gray">
                                    {rowNumberOffset + index + 1}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-midnight-slate">
                                    {client.clientName}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                    {client.phone}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                    {client.email}
                                </td>
                                <td className="px-4 py-4">
                                    <ClientStatusPill tone={client.status}>
                                        {client.statusLabel}
                                    </ClientStatusPill>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate capitalize">
                                    {client.plan}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-midnight-slate">
                                    {client.totalInvoiced}
                                </td>
                                <td
                                    className={cn(
                                        "whitespace-nowrap px-4 py-4 text-sm font-semibold",
                                        client.outstandingValue > 0
                                            ? "text-rose-500"
                                            : "text-teal-600"
                                    )}
                                >
                                    {client.outstanding}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray">
                                    {client.lastActivity}
                                </td>
                                <td className="px-4 py-4">
                                    <ClientActions
                                        clientName={client.clientName}
                                        isDeleting={deletingClientId === client.id}
                                        onEdit={() => onClientEdit(client)}
                                        onDelete={() => {
                                            void handleDeleteClient(client.id);
                                        }}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={10}
                                className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-gray"
                            >
                                No clients found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </DataTable>

            {alert ? (
                <StatusAlert
                    key={alert.id}
                    tone={alert.tone}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                />
            ) : null}
        </>
    );
}
