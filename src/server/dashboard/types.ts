export type DashboardMetricIcon = "revenue" | "clients" | "invoices" | "risk";
export type DashboardTone = "blue" | "mint" | "amber" | "rose";

export interface DashboardMetric {
    label: string;
    value: string;
    helper: string;
    icon: DashboardMetricIcon;
    tone: DashboardTone;
}

export interface DashboardRevenuePoint {
    month: string;
    revenue: number;
}

export interface DashboardAttentionItem {
    label: string;
    helper: string;
    icon: DashboardMetricIcon;
    tone: DashboardTone;
}

export interface DashboardClient {
    name: string;
    plan: string;
    status: "Active" | "Past Due";
}

export interface DashboardOverview {
    isGuest: boolean;
    currentMrr: string;
    metrics: DashboardMetric[];
    revenue: DashboardRevenuePoint[];
    attentionItems: DashboardAttentionItem[];
    recentClients: DashboardClient[];
}
