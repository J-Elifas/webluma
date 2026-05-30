"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import CreateInvoiceForm from "@/components/dashboard/CreateInvoiceForm";
import Modal from "@/components/ui/Modal";
import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import {
    addDaysToDateValue,
    createInvoiceNumber,
    formatDateValue,
    isValidDateValue,
} from "@/lib/utils";
import type {
    CreateInvoiceFormErrors,
    CreateInvoiceFormValues,
    CreateInvoiceInput,
    DashboardClientPlan,
    DashboardInvoiceClientOption,
} from "@/server/dashboard/types";

interface CreateInvoiceControllerProps {
    isOpen: boolean;
    onClose: () => void;
    clients: DashboardInvoiceClientOption[];
    onPendingChange?: (isPending: boolean) => void;
    onStatusChange?: (status: CreateInvoiceStatus) => void;
}

interface CreateInvoiceStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

const planLabels: Record<DashboardClientPlan, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
};
const invoiceNumberPrefix = "INV-";

function toInvoiceNumberSuffix(value: string) {
    return value.trimStart().replace(/^INV-/i, "");
}

function toInvoiceNumberValue(value: string) {
    return `${invoiceNumberPrefix}${value.trim()}`;
}

function createInitialFormValues(): CreateInvoiceFormValues {
    const issueDate = formatDateValue(new Date());

    return {
        clientId: "",
        plan: "",
        monthlyFee: "",
        clientEmail: "",
        periodStart: "",
        periodEnd: "",
        invoiceNumber: toInvoiceNumberSuffix(createInvoiceNumber()),
        issueDate,
        dueDate: addDaysToDateValue(issueDate, 7),
        amount: "",
        notes: "",
    };
}

function validateCreateInvoiceForm(
    values: CreateInvoiceFormValues,
    clients: DashboardInvoiceClientOption[]
) {
    const errors: CreateInvoiceFormErrors = {};
    const amount = Number(values.amount);
    const selectedClient = clients.find((client) => client.id === values.clientId);

    if (!values.clientId) {
        errors.clientId = "Select a client.";
    } else if (!selectedClient) {
        errors.clientId = "Select a valid client.";
    }

    if (!values.periodStart) {
        errors.periodStart = "Select a billing period start.";
    } else if (!isValidDateValue(values.periodStart)) {
        errors.periodStart = "Select a valid billing period start.";
    }

    if (!values.periodEnd) {
        errors.periodEnd = "Select a billing period start.";
    } else if (
        !isValidDateValue(values.periodEnd) ||
        values.periodEnd !== addDaysToDateValue(values.periodStart, 30)
    ) {
        errors.periodEnd = "Billing period end must be 30 days after the start.";
    }

    if (!values.invoiceNumber.trim()) {
        errors.invoiceNumber = "Enter an invoice number.";
    }

    if (!values.issueDate) {
        errors.issueDate = "Select an issue date.";
    } else if (!isValidDateValue(values.issueDate)) {
        errors.issueDate = "Select a valid issue date.";
    }

    if (!values.dueDate) {
        errors.dueDate = "Select a due date.";
    } else if (!isValidDateValue(values.dueDate)) {
        errors.dueDate = "Select a valid due date.";
    } else if (values.issueDate && values.dueDate < values.issueDate) {
        errors.dueDate = "Due date must be after the issue date.";
    }

    if (!values.amount.trim()) {
        errors.amount = "Enter an amount.";
    } else if (!Number.isFinite(amount) || amount < 0) {
        errors.amount = "Enter a valid amount.";
    }

    return errors;
}

function toCreateInvoiceInput(values: CreateInvoiceFormValues): CreateInvoiceInput {
    return {
        clientId: values.clientId,
        invoiceNumber: toInvoiceNumberValue(values.invoiceNumber),
        issueDate: values.issueDate,
        dueDate: values.dueDate,
        periodStart: values.periodStart,
        periodEnd: values.periodEnd,
        amount: Number(values.amount),
        notes: values.notes.trim() || undefined,
    };
}

async function readInvoiceResponse(response: Response) {
    try {
        return (await response.json()) as { ok?: boolean; message?: string };
    } catch {
        return {};
    }
}

export default function CreateInvoiceController({
    clients,
    isOpen,
    onClose,
    onPendingChange,
    onStatusChange,
}: CreateInvoiceControllerProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<CreateInvoiceFormValues>(createInitialFormValues);
    const [errors, setErrors] = useState<CreateInvoiceFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    function setSubmitError(message: string) {
        onStatusChange?.({
            tone: "error",
            title: "Invoice not created",
            message,
        });
    }

    function clearFieldError(fieldName: keyof CreateInvoiceFormValues) {
        setErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: undefined,
        }));
    }

    function clearFieldErrors(fieldNames: (keyof CreateInvoiceFormValues)[]) {
        setErrors((currentErrors) =>
            fieldNames.reduce(
                (nextErrors, fieldName) => ({
                    ...nextErrors,
                    [fieldName]: undefined,
                }),
                currentErrors
            )
        );
    }

    function handleModalClose() {
        if (isSubmitting) {
            return;
        }

        setFormValues(createInitialFormValues());
        setErrors({});
        onClose();
    }

    function handleClientChange(value: string) {
        const selectedClient = clients.find((client) => client.id === value);

        setFormValues((currentValues) => ({
            ...currentValues,
            clientId: selectedClient?.id ?? "",
            plan: selectedClient ? planLabels[selectedClient.plan] : "",
            monthlyFee: selectedClient ? String(selectedClient.monthlyFee) : "",
            clientEmail: selectedClient?.email ?? "",
            amount: selectedClient ? String(selectedClient.monthlyFee) : "",
        }));
        clearFieldErrors(["clientId", "plan", "monthlyFee", "clientEmail", "amount"]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const fieldName = event.target.name as keyof CreateInvoiceFormValues;
        const value =
            fieldName === "invoiceNumber"
                ? toInvoiceNumberSuffix(event.target.value)
                : event.target.value;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
        clearFieldError(fieldName);
    }

    function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const fieldName = event.target.name as keyof CreateInvoiceFormValues;
        const { value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
        clearFieldError(fieldName);
    }

    function handleDateChange(fieldName: "periodStart" | "issueDate" | "dueDate", value: string) {
        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
            ...(fieldName === "periodStart"
                ? {
                      periodEnd: addDaysToDateValue(value, 30),
                  }
                : {}),
        }));
        clearFieldErrors(fieldName === "periodStart" ? ["periodStart", "periodEnd"] : [fieldName]);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors = validateCreateInvoiceForm(formValues, clients);

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setPendingState(true);

        try {
            const response = await fetch("/api/dashboard/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(toCreateInvoiceInput(formValues)),
            });

            const result = await readInvoiceResponse(response);

            if (!response.ok || !result.ok) {
                setSubmitError(result.message || "Unable to save invoice. Please try again.");
                return;
            }

            onStatusChange?.({
                tone: "success",
                title: "Invoice created",
                message: result.message || "Invoice created!",
            });
            setFormValues(createInitialFormValues());
            onClose();
            router.refresh();
        } catch {
            setSubmitError("Unable to save invoice. Please try again.");
        } finally {
            setPendingState(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Create invoice"
            description="Prepare a manual invoice for a client and track its payment status."
            size="lg"
            onClose={handleModalClose}
        >
            <CreateInvoiceForm
                clients={clients}
                values={formValues}
                errors={errors}
                isSubmitting={isSubmitting}
                onCancel={handleModalClose}
                onClientChange={handleClientChange}
                onDateChange={handleDateChange}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onTextareaChange={handleTextareaChange}
            />
        </Modal>
    );
}
