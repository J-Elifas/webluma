import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { isRecord } from "@/lib/utils";
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
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "GUEST") {
        return NextResponse.json({ message: "You are not authenticate!" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Unknown data!" }, { status: 400 });
    }

    const input = parseReminderPreferences(body);
    if (!input) {
        return NextResponse.json({ message: "Input required!" }, { status: 400 });
    }

    const result = await updateBillingReminderPreferences(input, session.user.id);
    if (!result.ok) {
        return NextResponse.json(
            { message: result.message || "Something went wrong!" },
            { status: 400 }
        );
    }

    return NextResponse.json(result);
}
