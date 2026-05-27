"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import Button from "@/components/ui/Button";

interface AddClientFormProps {
    onCancel: () => void;
}

interface FieldLabelProps {
    children: string;
    htmlFor: string;
    isRequired?: boolean;
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    isRequired?: boolean;
    wrapperClassName?: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    isRequired?: boolean;
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
}

function FieldLabel({ children, htmlFor, isRequired = false }: FieldLabelProps) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-midnight-slate">
            {children}
            {isRequired ? (
                <span className="ml-1 text-red-500" aria-hidden="true">
                    *
                </span>
            ) : null}
        </label>
    );
}

function fieldClasses(className = "") {
    return [
        "mt-2 w-full rounded-xl border border-mist-gray bg-white px-3 py-2.5 text-sm text-midnight-slate shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-gray/75 focus:border-luma-blue focus:ring-2 focus:ring-luma-blue/20",
        className,
    ]
        .filter(Boolean)
        .join(" ");
}

function TextField({
    id,
    isRequired = false,
    label,
    wrapperClassName,
    className,
    ...props
}: TextFieldProps) {
    return (
        <div className={wrapperClassName}>
            <FieldLabel htmlFor={id} isRequired={isRequired}>
                {label}
            </FieldLabel>
            <input id={id} required={isRequired} className={fieldClasses(className)} {...props} />
        </div>
    );
}

function SelectField({
    children,
    id,
    isRequired = false,
    label,
    className,
    ...props
}: SelectFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id} isRequired={isRequired}>
                {label}
            </FieldLabel>
            <select id={id} required={isRequired} className={fieldClasses(className)} {...props}>
                {children}
            </select>
        </div>
    );
}

function TextareaField({ id, label, className, ...props }: TextareaFieldProps) {
    return (
        <div>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <textarea id={id} className={fieldClasses(className)} {...props} />
        </div>
    );
}

export default function AddClientForm({ onCancel }: AddClientFormProps) {
    return (
        <form className="space-y-6">
            <section className="space-y-4" aria-labelledby="client-details-heading">
                <h3 id="client-details-heading" className="text-sm font-black text-midnight-slate">
                    Client Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        id="company-name"
                        name="companyName"
                        label="Company Name"
                        placeholder="Acme Studio"
                        autoComplete="organization"
                        isRequired
                    />
                    <TextField
                        id="contact-person"
                        name="contactPerson"
                        label="Contact Person"
                        placeholder="Sarah Wilson"
                        autoComplete="name"
                        isRequired
                    />
                    <TextField
                        id="client-email"
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="sarah@acme.com"
                        autoComplete="email"
                        isRequired
                    />
                    <TextField
                        id="client-phone"
                        name="phone"
                        label="Phone"
                        type="tel"
                        placeholder="+64 198-xxxx-xxxx"
                        autoComplete="tel"
                        isRequired
                    />
                    <TextField
                        id="client-website"
                        name="website"
                        label="Website"
                        type="url"
                        placeholder="https://acme.com"
                        autoComplete="url"
                        wrapperClassName="sm:col-span-2"
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
                        defaultValue=""
                        isRequired
                    >
                        <option value="" disabled>
                            Select a plan
                        </option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </SelectField>
                    <TextField
                        id="monthly-fee"
                        name="monthlyFee"
                        label="Monthly Fee"
                        type="number"
                        placeholder="100"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        isRequired
                    />
                    <TextField
                        id="start-date"
                        name="startDate"
                        label="Start Date"
                        type="date"
                        isRequired
                    />
                    <TextField id="end-date" name="endDate" label="End Date" type="date" />
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
