import { InvoiceStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import {
    addDaysToDateValue,
    currencyFormatter,
    formatDateValue,
    formatShortDate,
    toUtcDate,
    toUtcDateValue,
} from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import {
    billingReminderDaysBeforeOptions,
    type BillingInvoiceInsights,
    type BillingReminderPreferences,
} from "./types";

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const defaultBillingReminderPreferences: BillingReminderPreferences = {
    remindersEnabled: true,
    reminderDaysBefore: 3,
};

function getEmptyBillingInvoiceInsights(): BillingInvoiceInsights {
    return {
        dueThisWeek: {
            amount: currencyFormatter.format(0),
            count: 0,
            dueByDate: "",
        },
        overdue: {
            amount: currencyFormatter.format(0),
            count: 0,
            daysOverdue: 0,
        },
    };
}

function getDaysBetweenDateValues(startDateValue: string, endDateValue: string) {
    const difference = toUtcDate(endDateValue).getTime() - toUtcDate(startDateValue).getTime();

    return Math.max(0, Math.round(difference / millisecondsPerDay));
}

async function getBillingInvoiceInsights(userId: string): Promise<BillingInvoiceInsights> {
    const todayValue = formatDateValue(new Date());
    const today = toUtcDate(todayValue);
    const dueThisWeekEnd = toUtcDate(addDaysToDateValue(todayValue, 7));
    const [dueThisWeek, overdue] = await Promise.all([
        prisma.invoice.aggregate({
            where: {
                client: {
                    userId,
                },
                dueDate: {
                    gte: today,
                    lte: dueThisWeekEnd,
                },
                status: InvoiceStatus.pending,
            },
            _count: {
                id: true,
            },
            _max: {
                dueDate: true,
            },
            _sum: {
                amount: true,
            },
        }),
        prisma.invoice.aggregate({
            where: {
                client: {
                    userId,
                },
                dueDate: {
                    lt: today,
                },
                status: InvoiceStatus.pending,
            },
            _count: {
                id: true,
            },
            _min: {
                dueDate: true,
            },
            _sum: {
                amount: true,
            },
        }),
    ]);
    const oldestOverdueDateValue = overdue._min.dueDate
        ? toUtcDateValue(overdue._min.dueDate)
        : todayValue;

    return {
        dueThisWeek: {
            amount: currencyFormatter.format(Number(dueThisWeek._sum.amount ?? 0)),
            count: dueThisWeek._count.id,
            dueByDate: dueThisWeek._max.dueDate ? formatShortDate(dueThisWeek._max.dueDate) : "",
        },
        overdue: {
            amount: currencyFormatter.format(Number(overdue._sum.amount ?? 0)),
            count: overdue._count.id,
            daysOverdue: overdue._min.dueDate
                ? getDaysBetweenDateValues(oldestOverdueDateValue, todayValue)
                : 0,
        },
    };
}

async function getBillingReminderPreferences(userId: string): Promise<BillingReminderPreferences> {
    const preferences = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            remindersEnabled: true,
            reminderDaysBefore: true,
        },
    });

    if (
        !preferences ||
        !billingReminderDaysBeforeOptions.includes(preferences.reminderDaysBefore)
    ) {
        return defaultBillingReminderPreferences;
    }

    return preferences;
}

export async function getBillingData() {
    const session = await getServerSession(authOptions);
    const isGuest = !session || session.user.role === "GUEST";

    if (isGuest) {
        return {
            invoiceInsights: getEmptyBillingInvoiceInsights(),
            reminderPreferences: defaultBillingReminderPreferences,
            isGuest,
        };
    }

    const [invoiceInsights, reminderPreferences] = await Promise.all([
        getBillingInvoiceInsights(session.user.id),
        getBillingReminderPreferences(session.user.id),
    ]);

    return {
        invoiceInsights,
        reminderPreferences,
        isGuest,
    };
}
