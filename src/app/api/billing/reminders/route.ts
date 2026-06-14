import { isRecord } from "@/lib/utils";
import { handleAuthenticatedJsonRequest } from "@/server/api/authenticated-json-handler";
import { updateBillingReminderPreferences } from "@/server/billing/mutations";
import { billingReminderDaysBeforeOptions } from "@/server/billing/types";
import type { BillingReminderPreferences } from "@/server/billing/types";

function parseReminderPreferences(body: unknown): BillingReminderPreferences | null {
    if (!isRecord(body)) {
        return null;
    }

    const remindersEnabled = body.remindersEnabled;
    const reminderDaysBefore = Number(body.reminderDaysBefore);

    if (
        typeof remindersEnabled !== "boolean" ||
        !billingReminderDaysBeforeOptions.includes(reminderDaysBefore)
    ) {
        return null;
    }

    return {
        remindersEnabled,
        reminderDaysBefore,
    };
}

export async function PATCH(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseReminderPreferences,
        mutate: updateBillingReminderPreferences,
    });
}
