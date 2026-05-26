import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import type { DashboardOverview } from "./types";

async function fetchDashboardSnapshot(isGuest: boolean): Promise<DashboardOverview> {
    return {
        isGuest,
        currentMrr: "$9,840",
        metrics: [
            {
                label: "Monthly Revenue",
                value: "$12,450",
                helper: "+18.2% from last month",
                icon: "revenue",
                tone: "blue",
            },
            {
                label: "Active Clients",
                value: "42",
                helper: "+6 new relationships",
                icon: "clients",
                tone: "mint",
            },
            {
                label: "Pending Invoices",
                value: "7",
                helper: "$4,280 waiting",
                icon: "invoices",
                tone: "amber",
            },
            {
                label: "Churn Risk",
                value: "3",
                helper: "2 need outreach today",
                icon: "risk",
                tone: "rose",
            },
        ],
        revenue: [
            { month: "Jan", revenue: 7200 },
            { month: "Feb", revenue: 8600 },
            { month: "Mar", revenue: 9400 },
            { month: "Apr", revenue: 10800 },
            { month: "May", revenue: 11850 },
            { month: "Jun", revenue: 12450 },
        ],
        attentionItems: [
            {
                label: "3 invoices are overdue",
                helper: "Send reminders before Friday close.",
                icon: "invoices",
                tone: "rose",
            },
            {
                label: "2 clients have inactive subscriptions",
                helper: "Review plan status and follow up.",
                icon: "risk",
                tone: "amber",
            },
            {
                label: "1 client upgraded to Pro plan",
                helper: "Confirm onboarding tasks are complete.",
                icon: "clients",
                tone: "mint",
            },
        ],
        recentClients: [
            { name: "Acme Studio", plan: "Pro", status: "Active" },
            { name: "Nova Creative", plan: "Starter", status: "Active" },
            { name: "Bright Labs", plan: "Pro", status: "Past Due" },
            { name: "Orbit Agency", plan: "Enterprise", status: "Active" },
        ],
        quickActions: [
            { label: "Add Client", icon: "add-client" },
            { label: "Create Invoice", icon: "create-invoice" },
            { label: "View Billing", icon: "view-billing" },
        ],
    };
}

export async function getDashboardOverview() {
    const session = await getServerSession(authOptions);

    return fetchDashboardSnapshot(session?.user.role === "GUEST");
}
