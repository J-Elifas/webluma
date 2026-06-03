import Button from "@/components/ui/Button";
import DateInputField from "@/components/ui/DateInputField";
import Modal from "@/components/ui/Modal";
import TextareaField from "@/components/ui/TextareaField";
import { formatDateValue } from "@/lib/utils";
import type { BillingInvoiceRow } from "@/server/invoices/types";

interface MarkInvoicePaidModalProps {
    isOpen: boolean;
    invoice: BillingInvoiceRow | null;
    onClose: () => void;
    onAfterClose?: () => void;
}

export default function MarkInvoicePaidModal({
    invoice,
    isOpen,
    onAfterClose,
    onClose,
}: MarkInvoicePaidModalProps) {
    if (!invoice) {
        return null;
    }

    const paidDateDefaultValue = formatDateValue(new Date());

    return (
        <Modal
            isOpen={isOpen}
            title="Mark invoice as paid?"
            size="md"
            onClose={onClose}
            onAfterClose={onAfterClose}
        >
            <div className="space-y-5">
                <dl className="grid gap-3 border-b border-mist-gray/70 pb-4 text-sm">
                    <div className="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:gap-3">
                        <dt className="font-medium text-slate-gray">Invoice:</dt>
                        <dd className="font-bold text-midnight-slate">{invoice.invoiceNumber}</dd>
                    </div>
                    <div className="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:gap-3">
                        <dt className="font-medium text-slate-gray">Client:</dt>
                        <dd className="font-bold text-midnight-slate">{invoice.clientName}</dd>
                    </div>
                    <div className="grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:gap-3">
                        <dt className="font-medium text-slate-gray">Amount:</dt>
                        <dd className="font-bold text-midnight-slate">{invoice.amount}</dd>
                    </div>
                </dl>

                <div className="space-y-4">
                    <DateInputField
                        id="mark-paid-date"
                        name="paidDate"
                        label="Paid Date"
                        defaultValue={paidDateDefaultValue}
                        calendarSize="md"
                        isRequired
                    />
                    <TextareaField
                        id="mark-paid-notes"
                        name="notes"
                        label="Notes optional"
                        rows={3}
                        className="min-h-24"
                    />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-mist-gray/70 pt-4 sm:flex-row sm:justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button">Mark as Paid</Button>
                </div>
            </div>
        </Modal>
    );
}
