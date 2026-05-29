import DashboardPageController from "./DashboardPageController";
import { getDashboardInvoiceClientOptions, getDashboardOverview } from "@/server/dashboard/queries";

export default async function DashboardPage() {
    const [overview, invoiceClientOptions] = await Promise.all([
        getDashboardOverview(),
        getDashboardInvoiceClientOptions(),
    ]);

    return (
        <DashboardPageController overview={overview} invoiceClientOptions={invoiceClientOptions} />
    );
}
