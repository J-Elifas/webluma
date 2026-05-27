import DashboardPageController from "./DashboardPageController";
import { getDashboardOverview } from "@/server/dashboard/queries";

export default async function DashboardPage() {
    const overview = await getDashboardOverview();

    return <DashboardPageController overview={overview} />;
}
