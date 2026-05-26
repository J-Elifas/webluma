import DashboardContent from "@/components/dashboard/DashboardContent";
import { getDashboardOverview } from "@/server/dashboard/queries";

export default async function DashboardPageController() {
    const overview = await getDashboardOverview();

    return <DashboardContent overview={overview} />;
}
