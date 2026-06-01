import { getBillingSessionState } from "@/server/billing/queries";
import { getInvoiceClientOptions } from "@/server/invoices/queries";
import BillingPageController from "./BillingPageController";

export default async function BillingPage() {
    const [invoiceClientOptions, billingSession] = await Promise.all([
        getInvoiceClientOptions(),
        getBillingSessionState(),
    ]);

    return (
        <BillingPageController
            invoiceClientOptions={invoiceClientOptions}
            isGuest={billingSession.isGuest}
        />
    );
}
