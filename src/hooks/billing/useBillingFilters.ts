"use client";

import { useMemo, useState } from "react";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
} from "@/server/invoices/types";
import usePagination from "@/hooks/usePagination";

const defaultBillingInvoiceFilters: BillingInvoiceFilters = {
    status: "all",
    clientId: "all",
    dueDateStart: "",
    dueDateEnd: "",
};
const billingInvoicePageSize = 5;

function matchesInvoiceStatusFilter(invoice: BillingInvoiceRow, filters: BillingInvoiceFilters) {
    return filters.status === "all" || invoice.status === filters.status;
}

function matchesInvoiceClientFilter(invoice: BillingInvoiceRow, filters: BillingInvoiceFilters) {
    return filters.clientId === "all" || invoice.clientId === filters.clientId;
}

function matchesInvoiceStartDateFilter(invoice: BillingInvoiceRow, filters: BillingInvoiceFilters) {
    return !filters.dueDateStart || invoice.dueDateValue >= filters.dueDateStart;
}

function matchesInvoiceEndDateFilter(invoice: BillingInvoiceRow, filters: BillingInvoiceFilters) {
    return !filters.dueDateEnd || invoice.dueDateValue <= filters.dueDateEnd;
}

const invoiceFilterChecks = [
    matchesInvoiceStatusFilter,
    matchesInvoiceClientFilter,
    matchesInvoiceStartDateFilter,
    matchesInvoiceEndDateFilter,
];

function getInvoiceSearchText(invoice: BillingInvoiceRow) {
    return [
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.billingPeriod,
        invoice.amount,
        invoice.amountValue.toString(),
        invoice.dueDate,
        invoice.dueDateValue,
        invoice.statusLabel,
        invoice.paymentNotes ?? "",
    ]
        .join(" ")
        .toLowerCase();
}

function invoiceMatchesFilters(invoice: BillingInvoiceRow, filters: BillingInvoiceFilters) {
    return invoiceFilterChecks.every((matchesFilter) => matchesFilter(invoice, filters));
}

function invoiceMatchesSearchTerms(invoice: BillingInvoiceRow, searchTerms: string[]) {
    if (searchTerms.length === 0) {
        return true;
    }

    const searchableInvoiceText = getInvoiceSearchText(invoice);

    return searchTerms.every((term) => searchableInvoiceText.includes(term));
}

function invoiceMatchesFilterState(
    invoice: BillingInvoiceRow,
    filters: BillingInvoiceFilters,
    searchTerms: string[]
) {
    if (!invoiceMatchesFilters(invoice, filters)) {
        return false;
    }

    return invoiceMatchesSearchTerms(invoice, searchTerms);
}

function getFilteredInvoices(
    tableData: BillingInvoiceTableData,
    filters: BillingInvoiceFilters,
    searchQuery: string
): BillingInvoiceRow[] {
    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return tableData.invoices.filter((invoice) =>
        invoiceMatchesFilterState(invoice, filters, searchTerms)
    );
}

function getFilteredInvoiceTableData(
    tableData: BillingInvoiceTableData,
    filteredInvoices: BillingInvoiceRow[],
    currentPage: number,
    pageStartIndex: number,
    totalPages: number
): BillingInvoiceTableData {
    return {
        ...tableData,
        invoices: filteredInvoices.slice(pageStartIndex, pageStartIndex + billingInvoicePageSize),
        currentPage,
        pageSize: billingInvoicePageSize,
        totalInvoices: filteredInvoices.length,
        totalPages,
    };
}

export default function useBillingFilters(invoiceTableData: BillingInvoiceTableData) {
    const [invoiceFilters, setInvoiceFilters] = useState(defaultBillingInvoiceFilters);
    const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
    const filteredInvoices = useMemo(
        () => getFilteredInvoices(invoiceTableData, invoiceFilters, invoiceSearchQuery),
        [invoiceFilters, invoiceSearchQuery, invoiceTableData]
    );
    const { currentPage, handlePageChange, pageStartIndex, resetPage, totalPages } = usePagination(
        filteredInvoices.length,
        billingInvoicePageSize
    );
    const filteredInvoiceTableData = useMemo(
        () =>
            getFilteredInvoiceTableData(
                invoiceTableData,
                filteredInvoices,
                currentPage,
                pageStartIndex,
                totalPages
            ),
        [currentPage, filteredInvoices, invoiceTableData, pageStartIndex, totalPages]
    );

    function handleInvoiceFiltersChange(filters: BillingInvoiceFilters) {
        setInvoiceFilters(filters);
        resetPage();
    }

    function handleInvoiceSearchQueryChange(query: string) {
        setInvoiceSearchQuery(query);
        resetPage();
    }

    function handleInvoicePageChange(page: number) {
        handlePageChange(page);
    }

    return {
        filteredInvoices,
        filteredInvoiceTableData,
        invoiceFilters,
        invoiceSearchQuery,
        handleInvoiceFiltersChange,
        handleInvoicePageChange,
        handleInvoiceSearchQueryChange,
    };
}
