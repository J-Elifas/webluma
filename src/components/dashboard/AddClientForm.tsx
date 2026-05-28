"use client";

import DateInputField from "@/components/ui/DateInputField";
import EmailInputField from "@/components/ui/EmailInputField";
import NumberInputField from "@/components/ui/NumberInputField";
import PhoneInputField from "@/components/ui/PhoneInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import TextInputField from "@/components/ui/TextInputField";
import UrlInputField from "@/components/ui/UrlInputField";
import Button from "@/components/ui/Button";

interface AddClientFormProps {
    onCancel: () => void;
}

const planOptions: SelectFieldOption[] = [
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
    { value: "enterprise", label: "Enterprise" },
];

export default function AddClientForm({ onCancel }: AddClientFormProps) {
    return (
        <form className="space-y-6">
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
                        isRequired
                    />
                    <TextInputField
                        id="contact-person"
                        name="contactPerson"
                        label="Contact Person"
                        placeholder="Sarah Wilson"
                        autoComplete="name"
                        isRequired
                    />
                    <EmailInputField
                        id="client-email"
                        name="email"
                        label="Email"
                        placeholder="sarah@acme.com"
                        autoComplete="email"
                        isRequired
                    />
                    <PhoneInputField
                        id="client-phone"
                        name="phone"
                        label="Phone"
                        placeholder="+64 198-xxxx-xxxx"
                        autoComplete="tel"
                        isRequired
                    />
                    <UrlInputField
                        id="client-website"
                        name="website"
                        label="Website"
                        placeholder="https://acme.com"
                        autoComplete="url"
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
                        isRequired
                    />
                    <DateInputField
                        id="start-date"
                        name="startDate"
                        label="Start Date"
                        isRequired
                    />
                    <DateInputField id="end-date" name="endDate" label="End Date" />
                </div>
            </section>

            <TextareaField
                id="client-notes"
                name="notes"
                label="Notes"
                rows={4}
                placeholder="Add handoff details, billing context, or onboarding notes."
            />

            <div className="flex flex-col-reverse gap-3 border-t border-mist-gray/70 pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled>
                    Save Client
                </Button>
            </div>
        </form>
    );
}
