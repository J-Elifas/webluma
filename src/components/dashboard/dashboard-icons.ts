import {
    AlertTriangle,
    CircleDollarSign,
    FileText,
    Plus,
    ReceiptText,
    Users,
    WalletCards,
    type LucideIcon,
} from "lucide-react";
import type {
    DashboardMetricIcon,
    DashboardTone,
    QuickActionIcon,
} from "@/server/dashboard/types";

export const metricIcons: Record<DashboardMetricIcon, LucideIcon> = {
    revenue: CircleDollarSign,
    clients: Users,
    invoices: ReceiptText,
    risk: AlertTriangle,
};

export const quickActionIcons: Record<QuickActionIcon, LucideIcon> = {
    "add-client": Plus,
    "create-invoice": FileText,
    "view-billing": WalletCards,
};

export const toneClasses: Record<DashboardTone, string> = {
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
};
