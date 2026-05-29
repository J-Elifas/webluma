"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import CreateInvoiceForm from "@/components/dashboard/CreateInvoiceForm";
import Modal from "@/components/ui/Modal";
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
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const planLabels: Record<DashboardClientPlan, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
};

function formatDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isValidDateValue(value: string) {
    const match = datePattern.exec(value);

    if (!match) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

function addDaysToDateValue(value: string, amount: number) {
    if (!isValidDateValue(value)) {
        return "";
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + amount);

    return formatDateValue(date);
}

function createInvoiceNumber() {
    const now = new Date();
    const date = formatDateValue(now).replaceAll("-", "");
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((value) => String(value).padStart(2, "0"))
        .join("");

    return `INV-${date}-${time}`;
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
        invoiceNumber: createInvoiceNumber(),
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
        invoiceNumber: values.invoiceNumber.trim(),
        issueDate: values.issueDate,
        dueDate: values.dueDate,
        periodStart: values.periodStart,
        periodEnd: values.periodEnd,
        amount: Number(values.amount),
        notes: values.notes.trim() || undefined,
    };
}

export default function CreateInvoiceController({
    clients,
    isOpen,
    onClose,
    onPendingChange,
}: CreateInvoiceControllerProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<CreateInvoiceFormValues>(createInitialFormValues);
    const [errors, setErrors] = useState<CreateInvoiceFormErrors>({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    function clearFieldError(fieldName: keyof CreateInvoiceFormValues) {
        setFormError("");
        setErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: undefined,
        }));
    }

    function clearFieldErrors(fieldNames: (keyof CreateInvoiceFormValues)[]) {
        setFormError("");
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
        setFormError("");
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
        const { value } = event.target;

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

        setFormError("");
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

            if (!response.ok) {
                setFormError("Unable to save invoice. Please try again.");
                return;
            }

            const result = (await response.json()) as { ok?: boolean };

            if (!result.ok) {
                setFormError("Unable to save invoice. Please try again.");
                return;
            }

            setFormValues(createInitialFormValues());
            onClose();
            router.refresh();
        } catch {
            setFormError("Unable to save invoice. Please try again.");
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
                formError={formError}
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
