import { toUtcDateValue } from "@/lib/utils";
import type { DashboardClient, DashboardClientPlan } from "./types";

export const dashboardClientPlanLabels: Record<DashboardClientPlan, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
};

interface DashboardClientStatusInput {
    startDate: Date;
    endDate: Date | null;
}

export function getDashboardClientStatus(
    { startDate: rawStartDate, endDate: rawEndDate }: DashboardClientStatusInput,
    today: string
): DashboardClient["status"] {
    const startDate = toUtcDateValue(rawStartDate);
    const endDate = rawEndDate ? toUtcDateValue(rawEndDate) : null;

    if (startDate > today) {
        return "Lead";
    }

    if (endDate && endDate < today) {
        return "Inactive";
    }

    return "Active";
}
