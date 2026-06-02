import { getBillingData } from "@/server/billing/queries";
import { getBillingInvoiceTableData, getInvoiceClient } from "@/server/invoices/queries";
import BillingPageController from "./BillingPageController";

export default async function BillingPage() {
    const [invoiceClient, invoiceTableData, billingSession] = await Promise.all([
        getInvoiceClient(),
        getBillingInvoiceTableData(),
        getBillingData(),
    ]);

    return (
        <BillingPageController
            invoiceClient={invoiceClient}
            invoiceTableData={invoiceTableData}
            isGuest={billingSession.isGuest}
        />
    );
}
