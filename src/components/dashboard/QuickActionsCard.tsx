"use client";

import { FileText, LucideIcon, WalletCards, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";

export type QuickActionId = "add-client" | "create-invoice";

interface QuickActionsCardProps {
    isGuest: boolean;
    onActionSelect: (action: QuickActionId) => void;
    onRouteNavigate: (href: string) => void;
}

interface QuickActionItem {
    label: string;
    action: QuickActionId;
    icon: LucideIcon;
}

const quickActions: QuickActionItem[] = [
    {
        label: "Add Client",
        action: "add-client",
        icon: UserPlus,
    },
    {
        label: "Create Invoice",
        action: "create-invoice",
        icon: FileText,
    },
];

export default function QuickActionsCard({
    isGuest,
    onActionSelect,
    onRouteNavigate,
}: QuickActionsCardProps) {
    return (
        <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <h2 className="text-lg font-black text-midnight-slate">Quick actions</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                Start common workflows from one place.
            </p>
            <div className="mt-5 space-y-3">
                {quickActions.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Button
                            key={item.action}
                            variant="dark"
                            size="md"
                            isFullWidth
                            disabled={isGuest}
                            onClick={() => onActionSelect(item.action)}
                            leftIcon={<Icon className="h-4 w-4" aria-hidden="true" />}
                        >
                            {item.label}
                        </Button>
                    );
                })}

                <ButtonLink
                    href="/billing"
                    variant="primary"
                    onNavigate={() => onRouteNavigate("/billing")}
                    className="shrink-0 gap-2 whitespace-nowrap rounded-2xl bg-midnight-slate px-4 py-3 font-bold shadow-[0_16px_32px_-24px_rgba(15,23,42,0.85)] hover:bg-slate-800"
                >
                    <WalletCards className="h-4 w-4" aria-hidden="true" />
                    View Billing
                </ButtonLink>
            </div>
            {isGuest ? (
                <p className="mt-4 rounded-2xl bg-cloud-white px-3 py-2 text-sm font-bold text-slate-gray">
                    Guest mode is view-only.
                </p>
            ) : null}
        </article>
    );
}
