import type { ChangeEventHandler, FormEventHandler } from "react";
import { CheckCircle2, ReceiptText } from "lucide-react";
import Button from "@/components/ui/Button";
import DateInputField from "@/components/ui/DateInputField";
import Modal from "@/components/ui/Modal";
import TextareaField from "@/components/ui/TextareaField";
import type {
    BillingInvoiceRow,
    MarkInvoicePaidFormErrors,
    MarkInvoicePaidFormValues,
} from "@/server/invoices/types";

interface MarkInvoicePaidModalProps {
    isOpen: boolean;
    invoice: BillingInvoiceRow | null;
    values: MarkInvoicePaidFormValues;
    errors: MarkInvoicePaidFormErrors;
    isSubmitting: boolean;
    isViewMode: boolean;
    onClose: () => void;
    onAfterClose?: () => void;
    onCancel: () => void;
    onDateChange: (value: string) => void;
    onNotesChange: ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function MarkInvoicePaidModal({
    errors,
    invoice,
    isOpen,
    isSubmitting,
    isViewMode,
    onAfterClose,
    onCancel,
    onClose,
    onDateChange,
    onNotesChange,
    onSubmit,
    values,
}: MarkInvoicePaidModalProps) {
    if (!invoice) {
        return null;
    }

    const modalTitle = isViewMode ? "Payment details" : "Mark invoice as paid?";
    const modalDescription = isViewMode
        ? "Review the recorded payment details for this invoice."
        : "Confirm the payment date and optional payment notes before completing this invoice.";

    return (
        <Modal
            isOpen={isOpen}
            title={modalTitle}
            description={modalDescription}
            size="md"
            onClose={onClose}
            onAfterClose={onAfterClose}
        >
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
                <section className="rounded-xl border border-mist-gray/80 bg-cloud-white/80 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-luma-blue/10 text-luma-blue">
                                <ReceiptText className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase text-slate-gray">
                                    Invoice
                                </p>
                                <p className="mt-1 truncate text-base font-black text-midnight-slate">
                                    {invoice.invoiceNumber}
                                </p>
                                <p className="mt-1 truncate text-sm font-semibold text-slate-gray">
                                    {invoice.clientName}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-mist-gray/80 bg-white px-4 py-3 text-left sm:text-right">
                            <p className="text-xs font-bold uppercase text-slate-gray">Amount</p>
                            <p className="mt-1 text-lg font-black text-midnight-slate">
                                {invoice.amount}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    <DateInputField
                        id="mark-paid-date"
                        name="paidDate"
                        label="Paid Date"
                        value={values.paidDate}
                        error={errors.paidDate}
                        placeholder={isViewMode ? "No paid date recorded" : "Select a date"}
                        disabled={isSubmitting || isViewMode}
                        calendarSize="sm"
                        triggerClassName={isViewMode ? "disabled:opacity-100" : undefined}
                        onValueChange={onDateChange}
                        isRequired={!isViewMode}
                    />
                    <TextareaField
                        id="mark-paid-notes"
                        name="notes"
                        label="Notes optional"
                        rows={3}
                        placeholder={
                            isViewMode
                                ? "No payment notes recorded."
                                : "Add payment confirmation details."
                        }
                        value={values.notes}
                        disabled={isSubmitting || isViewMode}
                        className="min-h-24"
                        onChange={onNotesChange}
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-mist-gray/70 pt-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        {isViewMode ? "Close" : "Cancel"}
                    </Button>
                    {isViewMode ? (
                        <Button
                            type="button"
                            variant="secondary"
                            leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            aria-disabled="true"
                            className="border-soft-mint/80 bg-soft-mint/55 text-teal-700 hover:bg-soft-mint/55"
                        >
                            Payment Complete
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Mark as Paid"}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
