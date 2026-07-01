"use client";

import type { FormEventHandler } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import Button from "@/components/ui/Button";
import DateInputField from "@/components/ui/DateInputField";
import EmailInputField from "@/components/ui/EmailInputField";
import NumberInputField from "@/components/ui/NumberInputField";
import PhoneInputField from "@/components/ui/PhoneInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import TextInputField from "@/components/ui/TextInputField";
import UrlInputField from "@/components/ui/UrlInputField";
import type { AddClientFormValues } from "@/server/clients/types";

const planOptions: SelectFieldOption[] = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" },
];

export default function AddClientForm({
    control,
    errors,
    isSubmitting,
    onCancel,
    onSubmit,
}: {
    control: Control<AddClientFormValues>;
    errors: FieldErrors<AddClientFormValues>;
    isSubmitting: boolean;
    onCancel: () => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}) {
    return (
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <section className="space-y-4" aria-labelledby="client-details-heading">
                <h3 id="client-details-heading" className="text-sm font-black text-midnight-slate">
                    Client Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                            <TextInputField
                                id="company-name"
                                label="Company Name"
                                placeholder="Acme Studio"
                                autoComplete="organization"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.companyName?.message}
                                disabled={isSubmitting}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="contactPerson"
                        control={control}
                        render={({ field }) => (
                            <TextInputField
                                id="contact-person"
                                label="Contact Person"
                                placeholder="Sarah Wilson"
                                autoComplete="name"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.contactPerson?.message}
                                disabled={isSubmitting}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <EmailInputField
                                id="client-email"
                                label="Email"
                                placeholder="sarah@acme.com"
                                autoComplete="email"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.email?.message}
                                disabled={isSubmitting}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneInputField
                                id="client-phone"
                                label="Phone"
                                placeholder="+64 198-xxxx-xxxx"
                                autoComplete="tel"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.phone?.message}
                                disabled={isSubmitting}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="website"
                        control={control}
                        render={({ field }) => (
                            <UrlInputField
                                id="client-website"
                                label="Website"
                                placeholder="https://acme.com"
                                autoComplete="url"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.website?.message}
                                disabled={isSubmitting}
                                className="sm:col-span-2"
                            />
                        )}
                    />
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="plan-details-heading">
                <h3 id="plan-details-heading" className="text-sm font-black text-midnight-slate">
                    Plan Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="plan"
                        control={control}
                        render={({ field }) => (
                            <SelectField
                                id="client-plan"
                                name={field.name}
                                label="Plan"
                                options={planOptions}
                                placeholder="Select a plan"
                                value={field.value}
                                error={errors.plan?.message}
                                disabled={isSubmitting}
                                onValueChange={field.onChange}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="monthlyFee"
                        control={control}
                        render={({ field }) => (
                            <NumberInputField
                                id="monthly-fee"
                                label="Monthly Fee"
                                placeholder="100"
                                min="0"
                                step="1"
                                inputMode="decimal"
                                value={field.value}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                error={errors.monthlyFee?.message}
                                disabled={isSubmitting}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <DateInputField
                                id="start-date"
                                name={field.name}
                                label="Start Date"
                                value={field.value}
                                error={errors.startDate?.message}
                                disabled={isSubmitting}
                                onValueChange={field.onChange}
                                isRequired
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <DateInputField
                                id="end-date"
                                name={field.name}
                                label="End Date"
                                value={field.value}
                                error={errors.endDate?.message}
                                disabled={isSubmitting}
                                onValueChange={field.onChange}
                            />
                        )}
                    />
                </div>
            </section>

            <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        id="client-notes"
                        label="Notes"
                        rows={4}
                        placeholder="Add handoff details, billing context, or onboarding notes."
                        value={field.value}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        error={errors.notes?.message}
                        disabled={isSubmitting}
                    />
                )}
            />

            <div className="flex flex-col-reverse gap-3 border-t border-mist-gray/70 pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Client"}
                </Button>
            </div>
        </form>
    );
}
