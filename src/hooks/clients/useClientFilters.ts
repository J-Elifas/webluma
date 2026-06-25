"use client";

import { useMemo, useState } from "react";
import usePagination from "@/hooks/usePagination";
import type { ClientFilters, ClientRow, ClientTableData } from "@/server/clients/types";

export const defaultClientFilters: ClientFilters = {
    status: "all",
    plan: "all",
};

function matchesClientStatusFilter(client: ClientRow, filters: ClientFilters) {
    return filters.status === "all" || client.status === filters.status;
}

function matchesClientPlanFilter(client: ClientRow, filters: ClientFilters) {
    return filters.plan === "all" || client.plan === filters.plan;
}

const clientFilterChecks = [matchesClientStatusFilter, matchesClientPlanFilter];

function getClientSearchText(client: ClientRow) {
    return [
        client.clientName,
        client.contactPerson,
        client.email,
        client.planLabel,
        client.statusLabel,
        client.totalInvoiced,
        client.totalInvoicedValue.toString(),
        client.outstanding,
        client.outstandingValue.toString(),
        client.lastActivity,
    ]
        .join(" ")
        .toLowerCase();
}

function clientMatchesFilters(client: ClientRow, filters: ClientFilters) {
    return clientFilterChecks.every((matchesFilter) => matchesFilter(client, filters));
}

function clientMatchesSearchTerms(client: ClientRow, searchTerms: string[]) {
    if (searchTerms.length === 0) {
        return true;
    }

    const searchableClientText = getClientSearchText(client);

    return searchTerms.every((term) => searchableClientText.includes(term));
}

function clientMatchesFilterState(
    client: ClientRow,
    filters: ClientFilters,
    searchTerms: string[]
) {
    if (!clientMatchesFilters(client, filters)) {
        return false;
    }

    return clientMatchesSearchTerms(client, searchTerms);
}

function getFilteredClients(
    tableData: ClientTableData,
    filters: ClientFilters,
    searchQuery: string
) {
    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return tableData.clients.filter((client) =>
        clientMatchesFilterState(client, filters, searchTerms)
    );
}

function getFilteredClientTableData(
    tableData: ClientTableData,
    filteredClients: ClientRow[],
    currentPage: number,
    pageSize: number,
    pageStartIndex: number,
    totalPages: number
): ClientTableData {
    return {
        ...tableData,
        clients: filteredClients.slice(pageStartIndex, pageStartIndex + pageSize),
        currentPage,
        pageSize,
        totalClients: filteredClients.length,
        totalPages,
    };
}

export default function useClientFilters(clientTableData: ClientTableData) {
    const [clientFilters, setClientFilters] = useState(defaultClientFilters);
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const pageSize = clientTableData.pageSize;
    const filteredClients = useMemo(
        () => getFilteredClients(clientTableData, clientFilters, clientSearchQuery),
        [clientFilters, clientSearchQuery, clientTableData]
    );
    const { currentPage, handlePageChange, pageStartIndex, resetPage, totalPages } = usePagination(
        filteredClients.length,
        pageSize
    );
    const filteredClientTableData = useMemo(
        () =>
            getFilteredClientTableData(
                clientTableData,
                filteredClients,
                currentPage,
                pageSize,
                pageStartIndex,
                totalPages
            ),
        [clientTableData, currentPage, filteredClients, pageSize, pageStartIndex, totalPages]
    );

    function handleClientFiltersChange(filters: ClientFilters) {
        setClientFilters(filters);
        resetPage();
    }

    function handleClientSearchQueryChange(query: string) {
        setClientSearchQuery(query);
        resetPage();
    }

    function handleClientPageChange(page: number) {
        handlePageChange(page);
    }

    return {
        clientFilters,
        clientSearchQuery,
        filteredClients,
        filteredClientTableData,
        handleClientFiltersChange,
        handleClientPageChange,
        handleClientSearchQueryChange,
    };
}
