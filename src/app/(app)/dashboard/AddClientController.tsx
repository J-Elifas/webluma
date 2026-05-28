"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AddClientForm from "@/components/dashboard/AddClientForm";
import Modal from "@/components/ui/Modal";
import type {
    AddClientFormErrors,
    AddClientFormValues,
    AddClientInput,
    DashboardClientPlan,
} from "@/server/dashboard/types";

interface AddClientControllerProps {
    isOpen: boolean;
    onClose: () => void;
    onPendingChange?: (isPending: boolean) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const dashboardClientPlans: DashboardClientPlan[] = ["starter", "pro", "enterprise"];

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

function isValidUrl(value: string) {
    try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
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

function validateAddClientForm(values: AddClientFormValues) {
    const errors: AddClientFormErrors = {};
    const trimmedCompanyName = values.companyName.trim();
    const trimmedContactPerson = values.contactPerson.trim();
    const trimmedEmail = values.email.trim();
    const trimmedPhone = values.phone.trim();
    const trimmedWebsite = values.website.trim();
    const monthlyFee = Number(values.monthlyFee);

    if (!trimmedCompanyName) {
        errors.companyName = "Enter the company name.";
    }

    if (!trimmedContactPerson) {
        errors.contactPerson = "Enter a contact person.";
    }

    if (!trimmedEmail) {
        errors.email = "Enter an email address.";
    } else if (!emailPattern.test(trimmedEmail)) {
        errors.email = "Enter a valid email address.";
    }

    if (!trimmedPhone) {
        errors.phone = "Enter a phone number.";
    }

    if (trimmedWebsite && !isValidUrl(trimmedWebsite)) {
        errors.website = "Enter a valid website URL.";
    }

    if (!values.plan) {
        errors.plan = "Select a plan.";
    }

    if (!values.monthlyFee.trim()) {
        errors.monthlyFee = "Enter the monthly fee.";
    } else if (!Number.isFinite(monthlyFee) || monthlyFee < 0) {
        errors.monthlyFee = "Enter a valid monthly fee.";
    }

    if (!values.startDate) {
        errors.startDate = "Select a start date.";
    } else if (!isValidDateValue(values.startDate)) {
        errors.startDate = "Select a valid start date.";
    }

    if (values.endDate && !isValidDateValue(values.endDate)) {
        errors.endDate = "Select a valid end date.";
    } else if (values.endDate && values.startDate && values.endDate < values.startDate) {
        errors.endDate = "End date must be after the start date.";
    }

    return errors;
}

function toAddClientInput(values: AddClientFormValues): AddClientInput {
    return {
        companyName: values.companyName.trim(),
        contactPerson: values.contactPerson.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        website: values.website.trim() || undefined,
        plan: values.plan as DashboardClientPlan,
        monthlyFee: Number(values.monthlyFee),
        startDate: values.startDate,
        endDate: values.endDate || undefined,
        notes: values.notes.trim() || undefined,
    };
}

export default function AddClientController({
    isOpen,
    onClose,
    onPendingChange,
}: AddClientControllerProps) {
    const router = useRouter();
    const [formValues, setFormValues] = useState<AddClientFormValues>(initialFormValues);
    const [errors, setErrors] = useState<AddClientFormErrors>({});
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    function clearFieldError(fieldName: keyof AddClientFormValues) {
        setFormError("");
        setErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: undefined,
        }));
    }

    function handleModalClose() {
        if (isSubmitting) {
            return;
        }

        setFormValues(initialFormValues);
        setErrors({});
        setFormError("");
        onClose();
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const fieldName = event.target.name as keyof AddClientFormValues;
        const { value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
        clearFieldError(fieldName);
    }

    function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const fieldName = event.target.name as keyof AddClientFormValues;
        const { value } = event.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
        clearFieldError(fieldName);
    }

    function handlePlanChange(value: AddClientFormValues["plan"]) {
        if (value && !dashboardClientPlans.includes(value)) {
            return;
        }

        setFormValues((currentValues) => ({
            ...currentValues,
            plan: value,
        }));
        clearFieldError("plan");
    }

    function handleDateChange(fieldName: "startDate" | "endDate", value: string) {
        setFormValues((currentValues) => ({
            ...currentValues,
            [fieldName]: value,
        }));
        clearFieldError(fieldName);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors = validateAddClientForm(formValues);

        setFormError("");
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setPendingState(true);

        try {
            const response = await fetch("/api/dashboard/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(toAddClientInput(formValues)),
            });

            if (!response.ok) {
                setFormError("Unable to save client. Please try again.");
                return;
            }

            const result = (await response.json()) as { ok?: boolean };

            if (!result.ok) {
                setFormError("Unable to save client. Please try again.");
                return;
            }

            setFormValues(initialFormValues);
            onClose();
            router.refresh();
        } catch {
            setFormError("Unable to save client. Please try again.");
        } finally {
            setPendingState(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Add client"
            description="Create a new client profile with contact and plan details."
            size="lg"
            onClose={handleModalClose}
        >
            <AddClientForm
                values={formValues}
                errors={errors}
                formError={formError}
                isSubmitting={isSubmitting}
                onCancel={handleModalClose}
                onDateChange={handleDateChange}
                onInputChange={handleInputChange}
                onPlanChange={handlePlanChange}
                onSubmit={handleSubmit}
                onTextareaChange={handleTextareaChange}
            />
        </Modal>
    );
}
