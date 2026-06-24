import { Bell, BellOff, CheckCircle2, Settings } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { BillingReminderPreferences } from "@/server/billing/types";
import type { BillingInvoiceRow } from "@/server/invoices/types";

interface PaymentRemindersCardProps {
    nextPaymentReminder: Pick<BillingInvoiceRow, "clientName" | "dueDate" | "invoiceNumber"> | null;
    preferences: BillingReminderPreferences;
    onManageReminders: () => void;
}

function getReminderTimingCopy(daysBefore: number) {
    return `In-app reminders appear ${daysBefore} day${daysBefore === 1 ? "" : "s"} before due date.`;
}

export default function PaymentRemindersCard({
    nextPaymentReminder,
    onManageReminders,
    preferences,
}: PaymentRemindersCardProps) {
    const StatusIcon = preferences.remindersEnabled ? CheckCircle2 : BellOff;

    return (
        <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-midnight-slate">Payment reminders</h2>
                <Bell className="h-5 w-5 text-midnight-slate" aria-hidden="true" />
            </div>

            <div className="mt-5 flex items-center gap-2">
                <StatusIcon
                    className={cn(
                        "h-4 w-4",
                        preferences.remindersEnabled ? "text-teal-600" : "text-slate-gray"
                    )}
                    aria-hidden="true"
                />
                <p
                    className={cn(
                        "text-sm font-bold",
                        preferences.remindersEnabled ? "text-teal-700" : "text-slate-gray"
                    )}
                >
                    Automatic reminders are {preferences.remindersEnabled ? "on" : "off"}
                </p>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-slate-gray">
                {getReminderTimingCopy(preferences.reminderDaysBefore)}
            </p>

            <div
                className={cn(
                    "mt-5 rounded-2xl border p-4",
                    nextPaymentReminder
                        ? "border-luma-blue/20 bg-luma-blue/10"
                        : "border-mist-gray/70 bg-cloud-white/80"
                )}
            >
                <p
                    className={cn(
                        "text-xs font-bold uppercase",
                        nextPaymentReminder ? "text-luma-blue" : "text-slate-gray"
                    )}
                >
                    Next reminder
                </p>
                {nextPaymentReminder ? (
                    <>
                        <p className="mt-2 text-sm font-bold text-midnight-slate">
                            {nextPaymentReminder.clientName}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-gray">
                            {nextPaymentReminder.invoiceNumber} - {nextPaymentReminder.dueDate}
                        </p>
                    </>
                ) : (
                    <p className="mt-2 text-sm font-semibold text-slate-gray">
                        No upcoming reminders.
                    </p>
                )}
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                isFullWidth
                className="mt-5 rounded-xl font-semibold"
                leftIcon={<Settings className="h-4 w-4 text-slate-gray" aria-hidden="true" />}
                onClick={onManageReminders}
            >
                Manage reminders
            </Button>
        </article>
    );
}
