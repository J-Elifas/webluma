import { getBillingData } from "@/server/billing/queries";
import { getBillingInvoiceTableData, getInvoiceClient } from "@/server/invoices/queries";
import BillingPageController from "./BillingPageController";

export default async function BillingPage() {
    const [invoiceClient, invoiceTableData, billingData] = await Promise.all([
        getInvoiceClient(),
        getBillingInvoiceTableData(),
        getBillingData(),
    ]);

    return (
        <BillingPageController
            invoiceClient={invoiceClient}
            invoiceInsights={billingData.invoiceInsights}
            invoiceTableData={invoiceTableData}
            isGuest={billingData.isGuest}
            reminderPreferences={billingData.reminderPreferences}
        />
    );
}
