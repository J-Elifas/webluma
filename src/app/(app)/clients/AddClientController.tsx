"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import AddClientForm from "@/components/clients/AddClientForm";
import Modal from "@/components/ui/Modal";
import type { StatusAlertTone } from "@/components/ui/StatusAlert";
import { scrollToFirstFieldError } from "@/lib/field-error-scroll";
import { isValidDateValue, isValidHttpUrl } from "@/lib/utils";
import { clientPlans } from "@/server/clients/options";
import type {
    AddClientFormValues,
    AddClientInput,
    ClientPlan,
    ClientRow,
    UpdateClientInput,
} from "@/server/clients/types";

interface AddClientControllerProps {
    client?: ClientRow | null;
    isOpen: boolean;
    onClose: () => void;
    onAfterClose?: () => void;
    onPendingChange?: (isPending: boolean) => void;
    onStatusChange?: (status: { tone: StatusAlertTone; title: string; message: string }) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const addClientFieldOrder = [
    "companyName",
    "contactPerson",
    "email",
    "phone",
    "website",
    "plan",
    "monthlyFee",
    "startDate",
    "endDate",
    "notes",
] as const satisfies readonly (keyof AddClientFormValues)[];
const addClientFieldIds: Record<(typeof addClientFieldOrder)[number], string> = {
    companyName: "company-name",
    contactPerson: "contact-person",
    email: "client-email",
    phone: "client-phone",
    website: "client-website",
    plan: "client-plan",
    monthlyFee: "monthly-fee",
    startDate: "start-date",
    endDate: "end-date",
    notes: "client-notes",
};
const initialFormValues: AddClientFormValues = {
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    plan: "",
    monthlyFee: "",
    startDate: "",
    endDate: "",
    notes: "",
};
const endDateRangeChecks = [
    (values: AddClientFormValues) => Boolean(values.startDate),
    (values: AddClientFormValues) => Boolean(values.endDate),
    (values: AddClientFormValues) => isValidDateValue(values.startDate),
    (values: AddClientFormValues) => isValidDateValue(values.endDate),
    (values: AddClientFormValues) => values.endDate < values.startDate,
] as const;

const addClientFormSchema = z
    .object({
        companyName: z.string().trim().min(1, "Enter the company name."),
        contactPerson: z.string().trim().min(1, "Enter a contact person."),
        email: z
            .string()
            .trim()
            .refine((value) => Boolean(value), "Enter an email address.")
            .refine((value) => !value || emailPattern.test(value), "Enter a valid email address."),
        phone: z.string().trim().min(1, "Enter a phone number."),
        website: z
            .string()
            .trim()
            .refine((value) => !value || isValidHttpUrl(value), "Enter a valid website URL."),
        plan: z
            .string()
            .refine((value) => clientPlans.includes(value as ClientPlan), "Select a plan."),
        monthlyFee: z
            .string()
            .trim()
            .refine((value) => Boolean(value), "Enter the monthly fee.")
            .refine((value) => {
                if (!value) {
                    return true;
                }

                const monthlyFee = Number(value);

                return Number.isFinite(monthlyFee) && monthlyFee >= 0;
            }, "Enter a valid monthly fee."),
        startDate: z
            .string()
            .refine((value) => Boolean(value), "Select a start date.")
            .refine((value) => !value || isValidDateValue(value), "Select a valid start date."),
        endDate: z
            .string()
            .trim()
            .refine((value) => !value || isValidDateValue(value), "Select a valid end date."),
        notes: z.string(),
    })
    .superRefine((values, context) => {
        if (hasInvalidEndDateRange(values)) {
            context.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date must be after the start date.",
            });
        }
    });

function hasInvalidEndDateRange(values: AddClientFormValues) {
    return endDateRangeChecks.every((check) => check(values));
}

function getInitialFormValues(client?: ClientRow | null): AddClientFormValues {
    if (!client) {
        return initialFormValues;
    }

    return {
        companyName: client.clientName,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        website: client.website,
        plan: client.plan,
        monthlyFee: String(client.monthlyFeeValue),
        startDate: client.startDateValue,
        endDate: client.endDateValue,
        notes: client.notes,
    };
}

function toClientInput(values: AddClientFormValues): AddClientInput {
    return {
        companyName: values.companyName.trim(),
        contactPerson: values.contactPerson.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        website: values.website.trim() || undefined,
        plan: values.plan as ClientPlan,
        monthlyFee: Number(values.monthlyFee),
        startDate: values.startDate,
        endDate: values.endDate || undefined,
        notes: values.notes.trim() || undefined,
    };
}

async function readClientResponse(response: Response) {
    try {
        return (await response.json()) as { ok?: boolean; message?: string };
    } catch {
        return {};
    }
}

function getClientSubmitErrorMessage(isEditing: boolean) {
    return isEditing
        ? "Unable to update client. Please try again."
        : "Unable to save client. Please try again.";
}

function getClientFailureStatus(isEditing: boolean, message?: string) {
    return {
        tone: "error" as const,
        title: isEditing ? "Client not updated" : "Client not created",
        message: message || getClientSubmitErrorMessage(isEditing),
    };
}

function getClientSuccessStatus(
    isEditing: boolean,
    clientInput: AddClientInput,
    message?: string
) {
    return {
        tone: "success" as const,
        title: isEditing ? "Client updated" : "Client created",
        message: isEditing
            ? `${clientInput.companyName} was updated successfully.`
            : message || "Client created!",
    };
}

function getFieldErrorMessages(errors: FieldErrors<AddClientFormValues>) {
    const fieldErrors: Partial<Record<keyof AddClientFormValues, string>> = {};

    addClientFieldOrder.forEach((fieldName) => {
        const message = errors[fieldName]?.message;

        if (typeof message === "string") {
            fieldErrors[fieldName] = message;
        }
    });

    return fieldErrors;
}

async function saveClient(client: ClientRow | null | undefined, values: AddClientFormValues) {
    const isEditing = Boolean(client);
    const clientInput = toClientInput(values);
    const body = getClientRequestBody(client, clientInput);
    const response = await fetch("/api/clients", {
        method: client ? "PATCH" : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const result = await readClientResponse(response);

    if (!response.ok || !result.ok) {
        return {
            ok: false,
            status: getClientFailureStatus(isEditing, result.message),
        };
    }

    return {
        ok: true,
        status: getClientSuccessStatus(isEditing, clientInput, result.message),
    };
}

function getClientRequestBody(
    client: ClientRow | null | undefined,
    clientInput: AddClientInput
): AddClientInput | UpdateClientInput {
    if (!client) {
        return clientInput;
    }

    return {
        ...clientInput,
        clientId: client.id,
    };
}

export default function AddClientController({
    client,
    isOpen,
    onAfterClose,
    onClose,
    onPendingChange,
    onStatusChange,
}: AddClientControllerProps) {
    const router = useRouter();
    const {
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        reset,
    } = useForm<AddClientFormValues>({
        defaultValues: getInitialFormValues(client),
        resolver: zodResolver(addClientFormSchema),
    });
    const isEditing = Boolean(client);
    const modalTitle = isEditing ? "Edit client" : "Add client";
    const modalDescription = isEditing
        ? "Update the client profile with current contact and plan details."
        : "Create a new client profile with contact and plan details.";

    function handleModalClose() {
        if (isSubmitting) {
            return;
        }

        onClose();
    }

    function handleModalAfterClose() {
        reset(initialFormValues);
        onAfterClose?.();
    }

    function handleInvalidSubmit(nextErrors: FieldErrors<AddClientFormValues>) {
        scrollToFirstFieldError(
            getFieldErrorMessages(nextErrors),
            addClientFieldOrder,
            addClientFieldIds
        );
    }

    async function handleValidSubmit(values: AddClientFormValues) {
        onPendingChange?.(true);

        const result = await getSaveResult(values);

        handleSaveResult(result);
        onPendingChange?.(false);
    }

    async function getSaveResult(values: AddClientFormValues) {
        try {
            return await saveClient(client, values);
        } catch {
            return {
                ok: false,
                status: getClientFailureStatus(isEditing),
            };
        }
    }

    function handleSaveResult(result: Awaited<ReturnType<typeof getSaveResult>>) {
        onStatusChange?.(result.status);

        if (result.ok) {
            onClose();
            router.refresh();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title={modalTitle}
            description={modalDescription}
            size="lg"
            onClose={handleModalClose}
            onAfterClose={handleModalAfterClose}
        >
            <AddClientForm
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                onCancel={handleModalClose}
                onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
            />
        </Modal>
    );
}
