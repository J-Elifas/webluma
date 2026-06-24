"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import MarkInvoicePaidModal from "@/components/billing/MarkInvoicePaidModal";
import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import { formatDateValue, isValidDateValue } from "@/lib/utils";
import type {
    BillingInvoiceRow,
    MarkInvoicePaidFormErrors,
    MarkInvoicePaidFormValues,
    MarkInvoicePaidMutationResult,
} from "@/server/invoices/types";

interface MarkInvoicePaidControllerProps {
    invoice: BillingInvoiceRow | null;
    isOpen: boolean;
    onClose: () => void;
    onAfterClose?: () => void;
    onPendingChange?: (isPending: boolean) => void;
    onStatusChange?: (status: MarkInvoicePaidStatus) => void;
}

interface MarkInvoicePaidStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

function createInitialFormValues(invoice: BillingInvoiceRow | null): MarkInvoicePaidFormValues {
    return {
        paidDate:
            invoice?.paidDate ?? (invoice?.status === "paid" ? "" : formatDateValue(new Date())),
        notes: invoice?.paymentNotes ?? "",
    };
}

function validateMarkInvoicePaidForm(values: MarkInvoicePaidFormValues) {
    const errors: MarkInvoicePaidFormErrors = {};

    if (!values.paidDate) {
        errors.paidDate = "Select a paid date.";
    } else if (!isValidDateValue(values.paidDate)) {
        errors.paidDate = "Select a valid paid date.";
    }

    return errors;
}

async function readInvoiceResponse(response: Response) {
    try {
        return (await response.json()) as MarkInvoicePaidMutationResult;
    } catch {
        return {
            ok: false,
        };
    }
}

export default function MarkInvoicePaidController({
    invoice,
    isOpen,
    onAfterClose,
    onClose,
    onPendingChange,
    onStatusChange,
}: MarkInvoicePaidControllerProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<MarkInvoicePaidFormValues>(() =>
        createInitialFormValues(invoice)
    );
    const [errors, setErrors] = useState<MarkInvoicePaidFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isViewMode = invoice?.status === "paid";

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    function handleModalClose() {
        if (isSubmitting) {
            return;
        }

        onClose();
    }

    function handleModalAfterClose() {
        setFormValues(createInitialFormValues(null));
        setErrors({});
        onAfterClose?.();
    }

    function handleDateChange(value: string) {
        setFormValues((currentValues) => ({
            ...currentValues,
            paidDate: value,
        }));
        setErrors((currentErrors) => ({
            ...currentErrors,
            paidDate: undefined,
        }));
    }

    function handleNotesChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setFormValues((currentValues) => ({
            ...currentValues,
            notes: event.target.value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!invoice || isViewMode) {
            return;
        }

        const nextErrors = validateMarkInvoicePaidForm(formValues);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setPendingState(true);

        try {
            const response = await fetch("/api/invoices", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    invoiceId: invoice.id,
                    paidDate: formValues.paidDate,
                    notes: formValues.notes.trim() || undefined,
                }),
            });

            const result = await readInvoiceResponse(response);

            if (!response.ok || !result.ok) {
                onStatusChange?.({
                    tone: "error",
                    title: "Payment not saved",
                    message:
                        result.message || "Unable to update invoice payment. Please try again.",
                });
                return;
            }

            onStatusChange?.({
                tone: "success",
                title: "Payment complete",
                message: result.message || "Payment marked complete.",
            });
            onClose();
            router.refresh();
        } catch {
            onStatusChange?.({
                tone: "error",
                title: "Payment not saved",
                message: "Unable to update invoice payment. Please try again.",
            });
        } finally {
            setPendingState(false);
        }
    }

    return (
        <MarkInvoicePaidModal
            errors={errors}
            invoice={invoice}
            isOpen={isOpen}
            isSubmitting={isSubmitting}
            isViewMode={isViewMode}
            values={formValues}
            onAfterClose={handleModalAfterClose}
            onCancel={handleModalClose}
            onClose={handleModalClose}
            onDateChange={handleDateChange}
            onNotesChange={handleNotesChange}
            onSubmit={handleSubmit}
        />
    );
}
