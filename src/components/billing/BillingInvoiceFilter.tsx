"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import DateInputField from "@/components/ui/DateInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import { cn } from "@/lib/utils";
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
    const popoverId = useId();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [draftFilters, setDraftFilters] = useState(filters);
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverRendered, setIsPopoverRendered] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({
        left: 0,
        maxHeight: 360,
        top: 0,
        width: 560,
    });
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
    const filterButtonLabel =
        appliedFilterCount > 0
            ? `Filter invoices, ${appliedFilterCount} ${appliedFilterCount === 1 ? "filter" : "filters"
            } applied`
            : "Filter invoices";

    function updatePopoverPosition() {
        const trigger = triggerRef.current;

        if (!trigger) {
            return;
        }

        const viewportPadding = 16;
        const triggerRect = trigger.getBoundingClientRect();
        const width = Math.min(560, window.innerWidth - viewportPadding * 2);
        const preferredLeft =
            window.innerWidth >= 640 ? triggerRect.right - width : triggerRect.left;
        const left = Math.min(
            Math.max(viewportPadding, preferredLeft),
            window.innerWidth - width - viewportPadding
        );
        const top = triggerRect.bottom + 8;
        const maxHeight = Math.max(220, window.innerHeight - top - viewportPadding);

        setPopoverPosition({
            left,
            maxHeight,
            top,
            width,
        });
    }

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;

            if (
                target instanceof Node &&
                (wrapperRef.current?.contains(target) || popoverRef.current?.contains(target))
            ) {
                return;
            }

            setIsOpen(false);
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleViewportChange() {
            updatePopoverPosition();
        }

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, true);

        return () => {
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange, true);
        };
    }, [isOpen]);

    function openPopover() {
        setDraftFilters(filters);
        updatePopoverPosition();
        setIsPopoverRendered(true);
        window.requestAnimationFrame(() => setIsOpen(true));
    }

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
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative flex-1 sm:flex-none">
            <Button
                ref={triggerRef}
                variant="secondary"
                size="sm"
                aria-label={filterButtonLabel}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-controls={popoverId}
                onClick={() => {
                    if (isOpen) {
                        setIsOpen(false);
                        return;
                    }

                    openPopover();
                }}
                className={cn(
                    "w-full min-w-[8.5rem] rounded-xl px-3 font-semibold transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-luma-blue/25 sm:w-auto",
                    isOpen && "border-luma-blue ring-2 ring-luma-blue/25"
                )}
                leftIcon={<Filter className="h-4 w-4 text-slate-gray" aria-hidden="true" />}
                rightIcon={
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-slate-gray transition-transform duration-150",
                            isOpen && "rotate-180 text-luma-blue"
                        )}
                        aria-hidden="true"
                    />
                }
            >
                <span>Filter</span>
                {appliedFilterCount > 0 ? (
                    <span
                        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-luma-blue px-1.5 text-xs font-black text-white"
                        aria-hidden="true"
                    >
                        {appliedFilterCount}
                    </span>
                ) : null}
            </Button>

            {isPopoverRendered
                ? createPortal(
                    <div
                        ref={popoverRef}
                        id={popoverId}
                        role="dialog"
                        aria-label="Invoice filters"
                        style={{
                            left: popoverPosition.left,
                            maxHeight: popoverPosition.maxHeight,
                            top: popoverPosition.top,
                            width: popoverPosition.width,
                        }}
                        onTransitionEnd={(event) => {
                            if (event.target === event.currentTarget && !isOpen) {
                                setIsPopoverRendered(false);
                            }
                        }}
                        className={cn(
                            "fixed z-50 origin-top overflow-visible rounded-[1.25rem] border border-mist-gray/80 bg-white p-4 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.65)] transition-all duration-150 ease-out",
                            isOpen
                                ? "translate-y-0 scale-100 opacity-100"
                                : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                        )}
                    >
                        <div className="flex items-center justify-between gap-3 border-b border-mist-gray/70 pb-3">
                            <p className="text-sm font-black text-midnight-slate">
                                Filter
                            </p>
                            <button
                                type="button"
                                onClick={handleResetDraft}
                                className="rounded-lg px-2 py-1 text-xs font-bold text-luma-blue transition-colors hover:bg-luma-blue/10 focus:outline-none focus:ring-2 focus:ring-luma-blue/25"
                            >
                                Reset
                            </button>
                        </div>

                        <form onSubmit={handleApply} noValidate>
                            <div className="grid grid-cols-2 gap-3 border-b border-mist-gray/70 py-4">
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
                                    label="Due Date From"
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
                                    label="Due Date To"
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
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" variant="secondary">
                                    Apply
                                </Button>
                            </div>
                        </form>
                    </div>,
                    document.body
                )
                : null}
        </div>
    );
}
