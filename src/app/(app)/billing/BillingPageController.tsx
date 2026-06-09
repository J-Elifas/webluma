"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import BillingContent from "@/components/billing/BillingContent";
import ReminderSettingsModal from "@/components/billing/ReminderSettingsModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert, { type StatusAlertTone } from "@/components/ui/StatusAlert";
import { addDaysToDateValue, formatDateValue } from "@/lib/utils";
import type { BillingInvoiceInsights, BillingReminderPreferences } from "@/server/billing/types";
import type {
    BillingInvoiceFilters,
    BillingInvoiceRow,
    BillingInvoiceTableData,
    InvoiceClient,
} from "@/server/invoices/types";
import MarkInvoicePaidController from "./MarkInvoicePaidController";
import CreateInvoiceController from "../invoices/CreateInvoiceController";

interface BillingPageControllerProps {
    invoiceClient: InvoiceClient[];
    invoiceInsights: BillingInvoiceInsights;
    invoiceTableData: BillingInvoiceTableData;
    isGuest: boolean;
    reminderPreferences: BillingReminderPreferences;
}

interface BillingInvoiceAlert {
    id: number;
    tone: StatusAlertTone;
    title: string;
    message: string;
}

const defaultBillingInvoiceFilters: BillingInvoiceFilters = {
    status: "all",
    clientId: "all",
    dueDateStart: "",
    dueDateEnd: "",
};

function getNextPaymentReminder(
    invoices: BillingInvoiceRow[],
    reminderPreferences: BillingReminderPreferences
): Pick<BillingInvoiceRow, "clientName" | "dueDate" | "invoiceNumber"> | null {
    if (!reminderPreferences.remindersEnabled) {
        return null;
    }

    const todayValue = formatDateValue(new Date());
    const reminderWindowEndValue = addDaysToDateValue(
        todayValue,
        reminderPreferences.reminderDaysBefore
    );
    let nextInvoice: BillingInvoiceRow | null = null;

    for (const invoice of invoices) {
        if (
            invoice.status !== "pending" ||
            invoice.dueDateValue < todayValue ||
            invoice.dueDateValue > reminderWindowEndValue
        ) {
            continue;
        }

        if (
            !nextInvoice ||
            invoice.dueDateValue < nextInvoice.dueDateValue ||
            (invoice.dueDateValue === nextInvoice.dueDateValue &&
                invoice.clientName.localeCompare(nextInvoice.clientName) < 0) ||
            (invoice.dueDateValue === nextInvoice.dueDateValue &&
                invoice.clientName === nextInvoice.clientName &&
                invoice.invoiceNumber.localeCompare(nextInvoice.invoiceNumber) < 0)
        ) {
            nextInvoice = invoice;
        }
    }

    return nextInvoice
        ? {
            clientName: nextInvoice.clientName,
            dueDate: nextInvoice.dueDate,
            invoiceNumber: nextInvoice.invoiceNumber,
        }
        : null;
}

function getFilteredInvoiceTableData(
    tableData: BillingInvoiceTableData,
    filters: BillingInvoiceFilters,
    searchQuery: string
): BillingInvoiceTableData {
    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const filteredInvoices = tableData.invoices.filter((invoice) => {
        if (filters.status !== "all" && invoice.status !== filters.status) {
            return false;
        }

        if (filters.clientId !== "all" && invoice.clientId !== filters.clientId) {
            return false;
        }

        if (filters.dueDateStart && invoice.dueDateValue < filters.dueDateStart) {
            return false;
        }

        if (filters.dueDateEnd && invoice.dueDateValue > filters.dueDateEnd) {
            return false;
        }

        if (searchTerms.length > 0) {
            const searchableInvoiceText = [
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

            if (!searchTerms.every((term) => searchableInvoiceText.includes(term))) {
                return false;
            }
        }

        return true;
    });

    return {
        ...tableData,
        invoices: filteredInvoices,
        currentPage: 1,
        totalInvoices: filteredInvoices.length,
        totalPages: Math.max(1, Math.ceil(filteredInvoices.length / tableData.pageSize)),
    };
}

export default function BillingPageController({
    invoiceClient,
    invoiceInsights,
    invoiceTableData,
    isGuest,
    reminderPreferences,
}: BillingPageControllerProps) {
    const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
    const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
    const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoiceRow | null>(null);
    const [invoiceFilters, setInvoiceFilters] = useState(defaultBillingInvoiceFilters);
    const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
    const [savedReminderPreferences, setSavedReminderPreferences] = useState(reminderPreferences);
    const [draftReminderPreferences, setDraftReminderPreferences] = useState(reminderPreferences);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingReminderSettings, setIsSavingReminderSettings] = useState(false);
    const [alert, setAlert] = useState<BillingInvoiceAlert | null>(null);
    const filteredInvoiceTableData = useMemo(
        () => getFilteredInvoiceTableData(invoiceTableData, invoiceFilters, invoiceSearchQuery),
        [invoiceFilters, invoiceSearchQuery, invoiceTableData]
    );
    const nextPaymentReminder = useMemo(
        () => getNextPaymentReminder(invoiceTableData.invoices, savedReminderPreferences),
        [invoiceTableData.invoices, savedReminderPreferences]
    );
    const isSaving = isLoading || isSavingReminderSettings;
    const loadingLabel = isSavingReminderSettings ? "Saving reminder settings" : "Saving invoice";

    useEffect(() => {
        if (!alert) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setAlert(null);
        }, 6000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [alert]);

    function handleCreateInvoiceSelect() {
        setIsCreateInvoiceOpen(true);
    }

    function handleInvoiceActionSelect(invoice: BillingInvoiceRow) {
        setSelectedInvoice(invoice);
        setIsMarkPaidOpen(true);
    }

    function handleMarkInvoicePaidAfterClose() {
        setSelectedInvoice(null);
    }

    function handleStatusAlert(nextAlert: Omit<BillingInvoiceAlert, "id">) {
        setAlert({
            ...nextAlert,
            id: Date.now(),
        });
    }

    function handleReminderSettingsOpen() {
        setDraftReminderPreferences(savedReminderPreferences);
        setIsReminderSettingsOpen(true);
    }

    function handleReminderSettingsClose() {
        if (isSavingReminderSettings) {
            return;
        }

        setIsReminderSettingsOpen(false);
    }

    function handleReminderSettingsAfterClose() {
        setDraftReminderPreferences(savedReminderPreferences);
    }

    function handleReminderEnabledChange(remindersEnabled: boolean) {
        setDraftReminderPreferences((currentPreferences) => ({
            ...currentPreferences,
            remindersEnabled,
        }));
    }

    function handleReminderDaysBeforeChange(reminderDaysBefore: number) {
        setDraftReminderPreferences((currentPreferences) => ({
            ...currentPreferences,
            reminderDaysBefore,
        }));
    }

    async function readReminderResponse(response: Response) {
        try {
            return (await response.json()) as {
                ok?: boolean;
                message?: string;
                preferences?: BillingReminderPreferences;
            };
        } catch {
            return {};
        }
    }

    async function handleReminderSettingsSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isGuest) {
            handleStatusAlert({
                tone: "error",
                title: "Settings not saved",
                message: "Unable to save reminder settings. Please try again.",
            });
            return;
        }

        setIsSavingReminderSettings(true);

        try {
            const response = await fetch("/api/billing/reminders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(draftReminderPreferences),
            });
            const result = await readReminderResponse(response);

            if (!response.ok || !result.ok) {
                handleStatusAlert({
                    tone: "error",
                    title: "Settings not saved",
                    message:
                        result.message || "Unable to save reminder settings. Please try again.",
                });
                return;
            }

            const nextReminderPreferences = result.preferences ?? draftReminderPreferences;

            setSavedReminderPreferences(nextReminderPreferences);
            setDraftReminderPreferences(nextReminderPreferences);
            handleStatusAlert({
                tone: "success",
                title: "Reminder settings saved",
                message: result.message || "Reminder settings saved.",
            });
            setIsReminderSettingsOpen(false);
        } catch {
            handleStatusAlert({
                tone: "error",
                title: "Settings not saved",
                message: "Unable to save reminder settings. Please try again.",
            });
        } finally {
            setIsSavingReminderSettings(false);
        }
    }

    return (
        <>
            <BillingContent
                filteredInvoiceTableData={filteredInvoiceTableData}
                invoiceClients={invoiceClient}
                invoiceFilters={invoiceFilters}
                invoiceInsights={invoiceInsights}
                invoiceSearchQuery={invoiceSearchQuery}
                invoiceTableData={invoiceTableData}
                isGuest={isGuest}
                nextPaymentReminder={nextPaymentReminder}
                reminderPreferences={savedReminderPreferences}
                onCreateInvoice={handleCreateInvoiceSelect}
                onInvoiceAction={handleInvoiceActionSelect}
                onInvoiceFiltersChange={setInvoiceFilters}
                onInvoiceSearchQueryChange={setInvoiceSearchQuery}
                onManageReminders={handleReminderSettingsOpen}
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

            <CreateInvoiceController
                clients={invoiceClient}
                isOpen={isCreateInvoiceOpen}
                onClose={() => setIsCreateInvoiceOpen(false)}
                onPendingChange={setIsLoading}
                onStatusChange={handleStatusAlert}
            />

            <MarkInvoicePaidController
                key={selectedInvoice?.id ?? "invoice-payment"}
                invoice={selectedInvoice}
                isOpen={isMarkPaidOpen}
                onClose={() => setIsMarkPaidOpen(false)}
                onAfterClose={handleMarkInvoicePaidAfterClose}
                onPendingChange={setIsLoading}
                onStatusChange={handleStatusAlert}
            />

            <ReminderSettingsModal
                isOpen={isReminderSettingsOpen}
                isSubmitting={isSavingReminderSettings}
                preferences={draftReminderPreferences}
                onAfterClose={handleReminderSettingsAfterClose}
                onCancel={handleReminderSettingsClose}
                onClose={handleReminderSettingsClose}
                onReminderDaysBeforeChange={handleReminderDaysBeforeChange}
                onReminderEnabledChange={handleReminderEnabledChange}
                onSubmit={handleReminderSettingsSubmit}
            />

            <LoadingSpinner isVisible={isSaving} label={loadingLabel} fullscreen />
        </>
    );
}
