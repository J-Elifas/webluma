"use client";

import { useState, type FormEvent } from "react";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TableFilterPopover from "@/components/ui/TableFilterPopover";
import { defaultClientFilters } from "@/hooks/clients/useClientFilters";
import { clientPlanLabels } from "@/server/clients/options";
import type { ClientFilters, ClientPlan, ClientStatusFilter } from "@/server/clients/types";

interface ClientFilterProps {
    filters: ClientFilters;
    onFiltersChange: (filters: ClientFilters) => void;
}

const statusFilterOptions: SelectFieldOption[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "lead", label: "Lead" },
    { value: "inactive", label: "Inactive" },
];
const planFilterOptions: SelectFieldOption[] = [
    { value: "all", label: "All plans" },
    ...Object.entries(clientPlanLabels).map(([value, label]) => ({
        value,
        label,
    })),
];

export default function ClientFilter({ filters, onFiltersChange }: ClientFilterProps) {
    const [draftFilters, setDraftFilters] = useState(filters);
    const appliedFilterCount =
        (filters.status !== "all" ? 1 : 0) + (filters.plan !== "all" ? 1 : 0);

    function handleStatusChange(status: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            status: status as ClientStatusFilter,
        }));
    }

    function handlePlanChange(plan: string) {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            plan: plan as ClientPlan | "all",
        }));
    }

    function handleResetDraft() {
        setDraftFilters(defaultClientFilters);
        onFiltersChange(defaultClientFilters);
    }

    function handleApply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onFiltersChange(draftFilters);
    }

    return (
        <TableFilterPopover
            appliedFilterCount={appliedFilterCount}
            ariaLabel="Filter clients"
            dialogLabel="Client filters"
            onApply={handleApply}
            onOpen={() => setDraftFilters(filters)}
            onReset={handleResetDraft}
        >
            <SelectField
                id="client-filter-status"
                label="Status"
                options={statusFilterOptions}
                value={draftFilters.status}
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handleStatusChange}
            />
            <SelectField
                id="client-filter-plan"
                label="Plan"
                options={planFilterOptions}
                value={draftFilters.plan}
                wrapperClassName="min-w-0"
                labelClassName="text-xs font-bold"
                triggerClassName="h-10 px-3 py-2"
                onValueChange={handlePlanChange}
            />
        </TableFilterPopover>
    );
}
