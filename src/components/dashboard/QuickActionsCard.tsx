import { quickActionIcons } from "./dashboard-icons";
import type { DashboardQuickAction } from "@/server/dashboard/types";

interface QuickActionsCardProps {
    actions: DashboardQuickAction[];
    isGuest: boolean;
}

export default function QuickActionsCard({ actions, isGuest }: QuickActionsCardProps) {
    return (
        <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <h2 className="text-lg font-black text-midnight-slate">Quick actions</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                Start common workflows from one place.
            </p>
            <div className="mt-5 space-y-3">
                {actions.map((action) => {
                    const Icon = quickActionIcons[action.icon];

                    return (
                        <button
                            key={action.label}
                            type="button"
                            disabled={isGuest}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-midnight-slate px-4 py-3 text-sm font-bold text-white shadow-[0_16px_32px_-24px_rgba(15,23,42,0.85)] transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-luma-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-gray/30 disabled:text-slate-gray"
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {action.label}
                        </button>
                    );
                })}
            </div>
            {isGuest ? (
                <p className="mt-4 rounded-2xl bg-cloud-white px-3 py-2 text-sm font-bold text-slate-gray">
                    Guest mode is view-only.
                </p>
            ) : null}
        </article>
    );
}
