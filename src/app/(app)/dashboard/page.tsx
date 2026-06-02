import DashboardPageController from "./DashboardPageController";
import { getDashboardOverview } from "@/server/dashboard/queries";
import { getInvoiceClient } from "@/server/invoices/queries";

export default async function DashboardPage() {
    const [overview, invoiceClient] = await Promise.all([
        getDashboardOverview(),
        getInvoiceClient(),
    ]);

    return <DashboardPageController overview={overview} invoiceClient={invoiceClient} />;
}
