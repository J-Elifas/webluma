import DashboardPageController from "./DashboardPageController";
import { getDashboardOverview } from "@/server/dashboard/queries";
import { getInvoiceClientOptions } from "@/server/invoices/queries";

export default async function DashboardPage() {
    const [overview, invoiceClientOptions] = await Promise.all([
        getDashboardOverview(),
        getInvoiceClientOptions(),
    ]);

    return (
        <DashboardPageController overview={overview} invoiceClientOptions={invoiceClientOptions} />
    );
}
