import type { ReactNode } from "react";
import {
    AlertTriangle,
    Bell,
    CalendarDays,
    CheckCircle2,
    ExternalLink,
    Settings,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";

type BillingInsightTone = "blue" | "mint" | "rose";

interface BillingInsightItemProps {
    children: ReactNode;
    icon: LucideIcon;
    tone: BillingInsightTone;
}

const insightToneClasses: Record<BillingInsightTone, string> = {
    blue: "bg-luma-blue/10 text-luma-blue",
    mint: "bg-soft-mint/50 text-teal-600",
    rose: "bg-rose-100 text-rose-600",
};

function BillingInsightItem({ children, icon: Icon, tone }: BillingInsightItemProps) {
    return (
        <div className="flex gap-3">
            <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${insightToneClasses[tone]}`}
            >
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">{children}</div>
        </div>
    );
}

export default function BillingSidePanel() {
    return (
        <aside className="space-y-4">
            <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-black text-midnight-slate">Billing insights</h2>
                    <TrendingUp className="h-5 w-5 text-luma-blue" aria-hidden="true" />
                </div>

                <div className="mt-5 space-y-5">
                    <BillingInsightItem icon={CalendarDays} tone="blue">
                        <p className="text-sm font-bold text-midnight-slate">
                            2 invoices due this week
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                            $548.00 is due by Jun 7, 2026
                        </p>
                    </BillingInsightItem>

                    <BillingInsightItem icon={AlertTriangle} tone="rose">
                        <p className="text-sm font-bold text-midnight-slate">
                            1 overdue invoice requires follow-up
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                            $149.00 is overdue by 2 days
                        </p>
                    </BillingInsightItem>
                </div>

                <span className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-bold text-midnight-slate shadow-sm">
                    View all reports
                    <ExternalLink className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                </span>
            </article>

            <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-black text-midnight-slate">Payment reminders</h2>
                    <Bell className="h-5 w-5 text-midnight-slate" aria-hidden="true" />
                </div>

                <div className="mt-5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden="true" />
                    <p className="text-sm font-bold text-teal-700">Automatic reminders are on</p>
                </div>

                <p className="mt-4 text-sm font-semibold leading-6 text-slate-gray">
                    We will send reminders 3 days before due date.
                </p>

                <div className="mt-5 rounded-2xl border border-luma-blue/20 bg-luma-blue/10 p-4">
                    <p className="text-xs font-bold uppercase text-luma-blue">Next reminder</p>
                    <p className="mt-2 text-sm font-bold text-midnight-slate">
                        Nova Creative - Jun 1, 2026
                    </p>
                </div>

                <span className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-black text-midnight-slate shadow-sm">
                    <Settings className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                    Manage reminders
                </span>
            </article>
        </aside>
    );
}
