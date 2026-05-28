"use client";

import type { ChangeEventHandler, FormEventHandler } from "react";
import DateInputField from "@/components/ui/DateInputField";
import EmailInputField from "@/components/ui/EmailInputField";
import NumberInputField from "@/components/ui/NumberInputField";
import PhoneInputField from "@/components/ui/PhoneInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import TextInputField from "@/components/ui/TextInputField";
import UrlInputField from "@/components/ui/UrlInputField";
import Button from "@/components/ui/Button";
import type { AddClientFormErrors, AddClientFormValues } from "@/server/dashboard/types";

interface AddClientFormProps {
    values: AddClientFormValues;
    errors: AddClientFormErrors;
    formError: string;
    isSubmitting: boolean;
    onCancel: () => void;
    onDateChange: (fieldName: "startDate" | "endDate", value: string) => void;
    onInputChange: ChangeEventHandler<HTMLInputElement>;
    onPlanChange: (value: AddClientFormValues["plan"]) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTextareaChange: ChangeEventHandler<HTMLTextAreaElement>;
}

const planOptions: SelectFieldOption[] = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" },
];

export default function AddClientForm({
    errors,
    formError,
    isSubmitting,
    onCancel,
    onDateChange,
    onInputChange,
    onPlanChange,
    onSubmit,
    onTextareaChange,
    values,
}: AddClientFormProps) {
    return (
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <section className="space-y-4" aria-labelledby="client-details-heading">
                <h3 id="client-details-heading" className="text-sm font-black text-midnight-slate">
                    Client Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextInputField
                        id="company-name"
                        name="companyName"
                        label="Company Name"
                        placeholder="Acme Studio"
                        autoComplete="organization"
                        value={values.companyName}
                        onChange={onInputChange}
                        error={errors.companyName}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <TextInputField
                        id="contact-person"
                        name="contactPerson"
                        label="Contact Person"
                        placeholder="Sarah Wilson"
                        autoComplete="name"
                        value={values.contactPerson}
                        onChange={onInputChange}
                        error={errors.contactPerson}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <EmailInputField
                        id="client-email"
                        name="email"
                        label="Email"
                        placeholder="sarah@acme.com"
                        autoComplete="email"
                        value={values.email}
                        onChange={onInputChange}
                        error={errors.email}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <PhoneInputField
                        id="client-phone"
                        name="phone"
                        label="Phone"
                        placeholder="+64 198-xxxx-xxxx"
                        autoComplete="tel"
                        value={values.phone}
                        onChange={onInputChange}
                        error={errors.phone}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <UrlInputField
                        id="client-website"
                        name="website"
                        label="Website"
                        placeholder="https://acme.com"
                        autoComplete="url"
                        value={values.website}
                        onChange={onInputChange}
                        error={errors.website}
                        disabled={isSubmitting}
                        className="sm:col-span-2"
                    />
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="plan-details-heading">
                <h3 id="plan-details-heading" className="text-sm font-black text-midnight-slate">
                    Plan Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                        id="client-plan"
                        name="plan"
                        label="Plan"
                        options={planOptions}
                        placeholder="Select a plan"
                        value={values.plan}
                        error={errors.plan}
                        disabled={isSubmitting}
                        onValueChange={(value) =>
                            onPlanChange(value as AddClientFormValues["plan"])
                        }
                        isRequired
                    />
                    <NumberInputField
                        id="monthly-fee"
                        name="monthlyFee"
                        label="Monthly Fee"
                        placeholder="100"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={values.monthlyFee}
                        onChange={onInputChange}
                        error={errors.monthlyFee}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <DateInputField
                        id="start-date"
                        name="startDate"
                        label="Start Date"
                        value={values.startDate}
                        error={errors.startDate}
                        disabled={isSubmitting}
                        onValueChange={(value) => onDateChange("startDate", value)}
                        isRequired
                    />
                    <DateInputField
                        id="end-date"
                        name="endDate"
                        label="End Date"
                        value={values.endDate}
                        error={errors.endDate}
                        disabled={isSubmitting}
                        onValueChange={(value) => onDateChange("endDate", value)}
                    />
                </div>
            </section>

            <TextareaField
                id="client-notes"
                name="notes"
                label="Notes"
                rows={4}
                placeholder="Add handoff details, billing context, or onboarding notes."
                value={values.notes}
                onChange={onTextareaChange}
                error={errors.notes}
                disabled={isSubmitting}
            />

            <div className="flex flex-col-reverse gap-3 border-t border-mist-gray/70 pt-5 sm:flex-row sm:justify-end">
                {formError ? (
                    <p className="text-sm font-medium text-red-500 sm:mr-auto">{formError}</p>
                ) : null}
                <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Client"}
                </Button>
            </div>
        </form>
    );
}
