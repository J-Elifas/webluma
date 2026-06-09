import { prisma } from "@/server/db/prisma";
import type { BillingReminderPreferences } from "./types";

export async function updateBillingReminderPreferences(
    input: BillingReminderPreferences,
    userId: string
) {
    try {
        const preferences = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                remindersEnabled: input.remindersEnabled,
                reminderDaysBefore: input.reminderDaysBefore,
            },
            select: {
                remindersEnabled: true,
                reminderDaysBefore: true,
            },
        });

        return {
            message: "Reminder settings saved.",
            ok: true,
            preferences,
        };
    } catch {
        return {
            message: "Unable to save reminder settings.",
            ok: false,
        };
    }
}
