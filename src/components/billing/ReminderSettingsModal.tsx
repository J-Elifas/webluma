import type { FormEventHandler } from "react";
import { BellRing, CheckCircle2, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import {
    billingReminderDaysBeforeOptions,
    type BillingReminderPreferences,
} from "@/server/billing/types";

interface ReminderSettingsModalProps {
    isOpen: boolean;
    isSubmitting: boolean;
    preferences: BillingReminderPreferences;
    onAfterClose?: () => void;
    onCancel: () => void;
    onClose: () => void;
    onReminderDaysBeforeChange: (daysBefore: number) => void;
    onReminderEnabledChange: (isEnabled: boolean) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
}

function getDaysBeforeLabel(daysBefore: number) {
    return `${daysBefore} day${daysBefore === 1 ? "" : "s"} before due date`;
}

function getReminderTimingCopy(daysBefore: number) {
    return `In-app reminders appear ${daysBefore} day${daysBefore === 1 ? "" : "s"} before due date.`;
}

export default function ReminderSettingsModal({
    isOpen,
    isSubmitting,
    onAfterClose,
    onCancel,
    onClose,
    onReminderDaysBeforeChange,
    onReminderEnabledChange,
    onSubmit,
    preferences,
}: ReminderSettingsModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            title="Reminder settings"
            size="md"
            onClose={onClose}
            onAfterClose={onAfterClose}
        >
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
                <section className="rounded-xl border border-mist-gray/80 bg-cloud-white/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="text-sm font-black text-midnight-slate">
                                Enable automatic reminders
                            </h3>
                            <p className="mt-1 text-sm font-semibold leading-6 text-slate-gray">
                                {getReminderTimingCopy(preferences.reminderDaysBefore)}
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={preferences.remindersEnabled}
                            aria-label="Enable automatic reminders"
                            disabled={isSubmitting}
                            onClick={() => onReminderEnabledChange(!preferences.remindersEnabled)}
                            className={cn(
                                "inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-luma-blue/30 disabled:cursor-not-allowed disabled:opacity-60",
                                preferences.remindersEnabled ? "bg-luma-blue" : "bg-mist-gray"
                            )}
                        >
                            <span
                                className={cn(
                                    "h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                                    preferences.remindersEnabled && "translate-x-5"
                                )}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </section>

                <fieldset className="space-y-3" disabled={isSubmitting}>
                    <legend className="text-sm font-black text-midnight-slate">
                        Reminder timing
                    </legend>
                    <div className="grid gap-2">
                        {billingReminderDaysBeforeOptions.map((daysBefore) => {
                            const isSelected = preferences.reminderDaysBefore === daysBefore;

                            return (
                                <label
                                    key={daysBefore}
                                    htmlFor={`reminder-days-before-${daysBefore}`}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold transition-colors duration-200",
                                        isSelected
                                            ? "border-luma-blue bg-luma-blue/10 text-midnight-slate"
                                            : "border-mist-gray/70 bg-white text-slate-gray hover:bg-cloud-white",
                                        isSubmitting && "cursor-not-allowed opacity-60"
                                    )}
                                >
                                    <input
                                        id={`reminder-days-before-${daysBefore}`}
                                        type="radio"
                                        name="reminderDaysBefore"
                                        value={daysBefore}
                                        checked={isSelected}
                                        disabled={isSubmitting}
                                        onChange={() => onReminderDaysBeforeChange(daysBefore)}
                                        className="peer sr-only"
                                    />
                                    <span
                                        className={cn(
                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border peer-focus-visible:ring-2 peer-focus-visible:ring-luma-blue/30",
                                            isSelected
                                                ? "border-luma-blue bg-white"
                                                : "border-mist-gray bg-white"
                                        )}
                                        aria-hidden="true"
                                    >
                                        {isSelected ? (
                                            <span className="h-2.5 w-2.5 rounded-full bg-luma-blue" />
                                        ) : null}
                                    </span>
                                    {getDaysBeforeLabel(daysBefore)}
                                </label>
                            );
                        })}
                    </div>
                </fieldset>

                <section className="space-y-3" aria-labelledby="reminder-type-heading">
                    <h3
                        id="reminder-type-heading"
                        className="text-sm font-black text-midnight-slate"
                    >
                        Reminder type
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-xl border border-luma-blue/30 bg-luma-blue/10 p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-luma-blue">
                                <BellRing className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-midnight-slate">
                                    In-app reminder
                                </p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-teal-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    Selected
                                </p>
                            </div>
                        </div>

                        <div
                            aria-disabled="true"
                            className="flex items-center gap-3 rounded-xl border border-mist-gray/70 bg-cloud-white/80 p-4 opacity-60"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-gray">
                                <Mail className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-midnight-slate">
                                    Email reminder
                                </p>
                                <p className="mt-1 text-xs font-bold text-slate-gray">
                                    coming soon
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col gap-3 border-t border-mist-gray/70 pt-4 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={isSubmitting}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save settings"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
