import { FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import type { BillingInvoiceTableData } from "@/server/invoices/types";
import BillingInvoicesPanel from "./BillingInvoicesPanel";
import BillingMetricCards from "./BillingMetricCards";
import BillingSidePanel from "./BillingSidePanel";

interface BillingContentProps {
    invoiceTableData: BillingInvoiceTableData;
    isGuest: boolean;
    onCreateInvoice: () => void;
}

export default function BillingContent({
    invoiceTableData,
    isGuest,
    onCreateInvoice,
}: BillingContentProps) {
    return (
        <>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <SectionHeading
                    title="Billing"
                    subtitle="Track invoices, payment status, and recurring revenue."
                />
                <Button
                    variant="dark"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={isGuest}
                    onClick={onCreateInvoice}
                    leftIcon={<FileText className="h-4 w-4" aria-hidden="true" />}
                >
                    Create Invoice
                </Button>
            </section>

            <BillingMetricCards />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <BillingInvoicesPanel tableData={invoiceTableData} />
                <BillingSidePanel />
            </section>
        </>
    );
}
