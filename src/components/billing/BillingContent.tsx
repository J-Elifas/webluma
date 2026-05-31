import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import BillingInvoicesPanel from "./BillingInvoicesPanel";
import BillingMetricCards from "./BillingMetricCards";
import BillingSidePanel from "./BillingSidePanel";

export default function BillingContent() {
    return (
        <>
            <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <SectionHeading
                    title="Billing"
                    subtitle="Track invoices, payment status, and recurring revenue."
                />
                <Button
                    variant="dark"
                    size="lg"
                    aria-disabled="true"
                    className="w-full sm:w-fit"
                    leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
                >
                    Create invoice
                </Button>
            </section>

            <BillingMetricCards />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <BillingInvoicesPanel />
                <BillingSidePanel />
            </section>
        </>
    );
}
