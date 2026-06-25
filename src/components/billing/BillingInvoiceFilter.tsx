"use client";

import DateInputField from "@/components/ui/DateInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TableFilterPopover from "@/components/ui/TableFilterPopover";
import { useState, type FormEvent } from "react";
import type {
    BillingInvoiceFilters,
    BillingInvoiceStatusFilter,
    InvoiceClient,
} from "@/server/invoices/types";

interface BillingInvoiceFilterProps {
    clients: InvoiceClient[];
    filters: BillingInvoiceFilters;
    onFiltersChange: (filters: BillingInvoiceFilters) => void;
}

const defaultBillingInvoiceFilters: BillingInvoiceFilters = {
    status: "all",
    clientId: "all",
    dueDateStart: "",
    dueDateEnd: "",
};

const statusFilterOptions: SelectFieldOption[] = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" },
];

export default function BillingInvoiceFilter({
    clients,
    filters,
    onFiltersChange,
}: BillingInvoiceFilterProps) {
    const [draftFilters, setDraftFilters] = useState(filters);
    const clientFilterOptions: SelectFieldOption[] = [
        { value: "all", label: "All clients" },
        ...clients.map((client) => ({
            value: client.id,
            label: client.companyName,
        })),
    ];
    const appliedFilterCount =
        (filters.status !== "all" ? 1 : 0) +
        (filters.clientId !== "all" ? 1 : 0) +
        (filters.dueDateStart || filters.dueDateEnd ? 1 : 0);

    function handleStatusChange(status: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            status: status as BillingInvoiceStatusFilter,
        }));
    }

    function handleClientChange(clientId: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            clientId,
        }));
    }

    function handleDueDateStartChange(dueDateStart: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            dueDateStart,
            dueDateEnd:
                dueDateStart &&
                currentFilters.dueDateEnd &&
                currentFilters.dueDateEnd < dueDateStart
                    ? ""
                    : currentFilters.dueDateEnd,
        }));
    }

    function handleDueDateEndChange(dueDateEnd: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            dueDateEnd,
        }));
    }

    function handleResetDraft() {
        setDraftFilters(defaultBillingInvoiceFilters);
        onFiltersChange(defaultBillingInvoiceFilters);
    }

    function handleApply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onFiltersChange(draftFilters);
    }

    return (
        <TableFilterPopover
            appliedFilterCount={appliedFilterCount}
            ariaLabel="Filter invoices"
            dialogLabel="Invoice filters"
            onApply={handleApply}
            onOpen={() => setDraftFilters(filters)}
            onReset={handleResetDraft}
        >
            <SelectField
                id="invoice-filter-status"
                label="Status"
                options={statusFilterOptions}
                value={draftFilters.status}
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handleStatusChange}
            />
            <SelectField
                id="invoice-filter-client"
                label="Client"
                options={clientFilterOptions}
                value={draftFilters.clientId}
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handleClientChange}
            />
            <DateInputField
                id="invoice-filter-start-date"
                label="Start Due Date"
                value={draftFilters.dueDateStart}
                max={draftFilters.dueDateEnd || undefined}
                calendarLabel="Invoice due date filter start date"
                calendarPlacement="top"
                calendarSize="sm"
                mobileCalendarPresentation="center"
                placeholder="From date"
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handleDueDateStartChange}
            />
            <DateInputField
                id="invoice-filter-end-date"
                label="End Due Date"
                value={draftFilters.dueDateEnd}
                min={draftFilters.dueDateStart || undefined}
                calendarLabel="Invoice due date filter end date"
                calendarPlacement="top"
                calendarSize="sm"
                mobileCalendarPresentation="center"
                placeholder="To date"
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handleDueDateEndChange}
            />
        </TableFilterPopover>
    );
}
