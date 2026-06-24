"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import { addDaysToDateValue, formatDateValue } from "@/lib/utils";
import type { BillingReminderPreferences } from "@/server/billing/types";
import type { BillingInvoiceRow } from "@/server/invoices/types";

interface BillingReminderStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

interface UseBillingReminderSettingsOptions {
    initialReminderPreferences: BillingReminderPreferences;
    invoices: BillingInvoiceRow[];
    isGuest: boolean;
    onStatusChange: (status: BillingReminderStatus) => void;
}

interface SaveReminderPreferencesSuccess {
    ok: true;
    message?: string;
    preferences: BillingReminderPreferences;
}

interface SaveReminderPreferencesFailure {
    ok: false;
    message: string;
}

type SaveReminderPreferencesResult =
    | SaveReminderPreferencesFailure
    | SaveReminderPreferencesSuccess;

const reminderSettingsErrorMessage = "Unable to save reminder settings. Please try again.";

function isInvoiceInReminderWindow(
    invoice: BillingInvoiceRow,
    todayValue: string,
    reminderWindowEndValue: string
) {
    return (
        invoice.status === "pending" &&
        invoice.dueDateValue >= todayValue &&
        invoice.dueDateValue <= reminderWindowEndValue
    );
}

function compareReminderInvoices(firstInvoice: BillingInvoiceRow, secondInvoice: BillingInvoiceRow) {
    const dueDateComparison = firstInvoice.dueDateValue.localeCompare(secondInvoice.dueDateValue);

    if (dueDateComparison !== 0) {
        return dueDateComparison;
    }

    const clientNameComparison = firstInvoice.clientName.localeCompare(secondInvoice.clientName);

    if (clientNameComparison !== 0) {
        return clientNameComparison;
    }

    return firstInvoice.invoiceNumber.localeCompare(secondInvoice.invoiceNumber);
}

function toPaymentReminder(
    invoice: BillingInvoiceRow
): Pick<BillingInvoiceRow, "clientName" | "dueDate" | "invoiceNumber"> {
    return {
        clientName: invoice.clientName,
        dueDate: invoice.dueDate,
        invoiceNumber: invoice.invoiceNumber,
    };
}

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
    const nextInvoice = invoices
        .filter((invoice) =>
            isInvoiceInReminderWindow(invoice, todayValue, reminderWindowEndValue)
        )
        .sort(compareReminderInvoices)[0];

    return nextInvoice ? toPaymentReminder(nextInvoice) : null;
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

async function saveReminderPreferences(
    preferences: BillingReminderPreferences
): Promise<SaveReminderPreferencesResult> {
    try {
        const response = await fetch("/api/billing/reminders", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(preferences),
        });
        const result = await readReminderResponse(response);

        if (!response.ok || !result.ok) {
            return {
                ok: false,
                message: result.message || reminderSettingsErrorMessage,
            };
        }

        return {
            ok: true,
            message: result.message,
            preferences: result.preferences ?? preferences,
        };
    } catch {
        return {
            ok: false,
            message: reminderSettingsErrorMessage,
        };
    }
}

export default function useBillingReminderSettings({
    initialReminderPreferences,
    invoices,
    isGuest,
    onStatusChange,
}: UseBillingReminderSettingsOptions) {
    const [savedReminderPreferences, setSavedReminderPreferences] =
        useState(initialReminderPreferences);
    const [draftReminderPreferences, setDraftReminderPreferences] =
        useState(initialReminderPreferences);
    const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
    const [isSavingReminderSettings, setIsSavingReminderSettings] = useState(false);
    const nextPaymentReminder = useMemo(
        () => getNextPaymentReminder(invoices, savedReminderPreferences),
        [invoices, savedReminderPreferences]
    );

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

    function showReminderSettingsError(message = reminderSettingsErrorMessage) {
        onStatusChange({
            tone: "error",
            title: "Settings not saved",
            message,
        });
    }

    function handleReminderSettingsSaved(result: SaveReminderPreferencesSuccess) {
        setSavedReminderPreferences(result.preferences);
        setDraftReminderPreferences(result.preferences);
        onStatusChange({
            tone: "success",
            title: "Reminder settings saved",
            message: result.message || "Reminder settings saved.",
        });
        setIsReminderSettingsOpen(false);
    }

    async function handleReminderSettingsSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isGuest) {
            showReminderSettingsError();
            return;
        }

        setIsSavingReminderSettings(true);

        const result = await saveReminderPreferences(draftReminderPreferences);

        if (result.ok) {
            handleReminderSettingsSaved(result);
        } else {
            showReminderSettingsError(result.message);
        }

        setIsSavingReminderSettings(false);
    }

    return {
        draftReminderPreferences,
        isReminderSettingsOpen,
        isSavingReminderSettings,
        nextPaymentReminder,
        savedReminderPreferences,
        handleReminderDaysBeforeChange,
        handleReminderEnabledChange,
        handleReminderSettingsAfterClose,
        handleReminderSettingsClose,
        handleReminderSettingsOpen,
        handleReminderSettingsSubmit,
    };
}
