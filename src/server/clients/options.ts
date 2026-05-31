import type { ClientPlan } from "./types";

export const clientPlans: ClientPlan[] = ["starter", "pro", "enterprise"];

export const clientPlanLabels: Record<ClientPlan, string> = {
    starter: "Starter",
    pro: "Pro",
    enterprise: "Enterprise",
};
