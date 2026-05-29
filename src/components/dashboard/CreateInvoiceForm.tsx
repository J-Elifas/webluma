"use client";

import type { ChangeEventHandler, FormEventHandler } from "react";
import Button from "@/components/ui/Button";
import DateInputField from "@/components/ui/DateInputField";
import EmailInputField from "@/components/ui/EmailInputField";
import NumberInputField from "@/components/ui/NumberInputField";
import SelectField, { type SelectFieldOption } from "@/components/ui/SelectField";
import TextareaField from "@/components/ui/TextareaField";
import TextInputField from "@/components/ui/TextInputField";
import type {
    CreateInvoiceFormErrors,
    CreateInvoiceFormValues,
    DashboardInvoiceClientOption,
} from "@/server/dashboard/types";

interface CreateInvoiceFormProps {
    clients: DashboardInvoiceClientOption[];
    values: CreateInvoiceFormValues;
    errors: CreateInvoiceFormErrors;
    formError: string;
    isSubmitting: boolean;
    onCancel: () => void;
    onClientChange: (value: string) => void;
    onDateChange: (fieldName: "periodStart" | "issueDate" | "dueDate", value: string) => void;
    onInputChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTextareaChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function CreateInvoiceForm({
    clients,
    errors,
    formError,
    isSubmitting,
    onCancel,
    onClientChange,
    onDateChange,
    onInputChange,
    onSubmit,
    onTextareaChange,
    values,
}: CreateInvoiceFormProps) {
    const clientOptions: SelectFieldOption[] = clients.map((client) => ({
        value: client.id,
        label: `${client.companyName} - ${client.email}`,
    }));
    const hasClients = clients.length > 0;

    return (
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <section className="space-y-4" aria-labelledby="invoice-client-heading">
                <h3 id="invoice-client-heading" className="text-sm font-black text-midnight-slate">
                    Client Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                        id="invoice-client"
                        name="clientId"
                        label="Client"
                        options={clientOptions}
                        placeholder={hasClients ? "Select a client" : "No clients available"}
                        value={values.clientId}
                        error={errors.clientId}
                        disabled={isSubmitting || !hasClients}
                        onValueChange={onClientChange}
                        wrapperClassName="sm:col-span-2"
                        isRequired
                    />
                    <TextInputField
                        id="invoice-client-plan"
                        name="plan"
                        label="Plan"
                        placeholder="Select a client"
                        value={values.plan}
                        readOnly
                        controlClassName="bg-cloud-white"
                    />
                    <NumberInputField
                        id="invoice-monthly-fee"
                        name="monthlyFee"
                        label="Monthly Fee"
                        placeholder="0"
                        inputMode="decimal"
                        value={values.monthlyFee}
                        readOnly
                        controlClassName="bg-cloud-white"
                    />
                    <EmailInputField
                        id="invoice-client-email"
                        name="clientEmail"
                        label="Client Email"
                        placeholder="client@example.com"
                        value={values.clientEmail}
                        readOnly
                        className="sm:col-span-2"
                        controlClassName="bg-cloud-white"
                    />
                </div>
                {!hasClients ? (
                    <p className="rounded-xl bg-cloud-white px-3 py-2 text-sm font-bold text-slate-gray">
                        Add a client before creating an invoice.
                    </p>
                ) : null}
            </section>

            <section className="space-y-4" aria-labelledby="billing-period-heading">
                <h3 id="billing-period-heading" className="text-sm font-black text-midnight-slate">
                    Billing Period
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <DateInputField
                        id="billing-period-start"
                        name="periodStart"
                        label="Billing Period Start"
                        value={values.periodStart}
                        error={errors.periodStart}
                        disabled={isSubmitting}
                        onValueChange={(value) => onDateChange("periodStart", value)}
                        isRequired
                    />
                    <DateInputField
                        id="billing-period-end"
                        name="periodEnd"
                        label="Billing Period End"
                        value={values.periodEnd}
                        error={errors.periodEnd}
                        disabled
                    />
                </div>
            </section>

            <section className="space-y-4" aria-labelledby="invoice-details-heading">
                <h3 id="invoice-details-heading" className="text-sm font-black text-midnight-slate">
                    Invoice Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextInputField
                        id="invoice-number"
                        name="invoiceNumber"
                        label="Invoice Number"
                        placeholder="INV-20260529-001"
                        value={values.invoiceNumber}
                        onChange={onInputChange}
                        error={errors.invoiceNumber}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <NumberInputField
                        id="invoice-amount"
                        name="amount"
                        label="Amount"
                        placeholder="100"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={values.amount}
                        onChange={onInputChange}
                        error={errors.amount}
                        disabled={isSubmitting}
                        isRequired
                    />
                    <DateInputField
                        id="invoice-issue-date"
                        name="issueDate"
                        label="Issue Date"
                        value={values.issueDate}
                        error={errors.issueDate}
                        disabled={isSubmitting}
                        onValueChange={(value) => onDateChange("issueDate", value)}
                        isRequired
                    />
                    <DateInputField
                        id="invoice-due-date"
                        name="dueDate"
                        label="Due Date"
                        value={values.dueDate}
                        error={errors.dueDate}
                        disabled={isSubmitting}
                        onValueChange={(value) => onDateChange("dueDate", value)}
                        isRequired
                    />
                </div>
            </section>

            <TextareaField
                id="invoice-notes"
                name="notes"
                label="Notes"
                rows={4}
                placeholder="Add payment instructions, invoice context, or internal notes."
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
                <Button type="submit" disabled={isSubmitting || !hasClients}>
                    {isSubmitting ? "Saving..." : "Create Invoice"}
                </Button>
            </div>
        </form>
    );
}
