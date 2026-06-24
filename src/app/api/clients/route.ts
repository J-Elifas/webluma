import { getOptionalStringField, getStringField, isRecord, isValidDateValue } from "@/lib/utils";
import { handleAuthenticatedJsonRequest } from "@/server/api/authenticated-json-handler";
import { createClient } from "@/server/clients/mutations";
import { clientPlans } from "@/server/clients/options";
import type { AddClientInput, ClientPlan } from "@/server/clients/types";

function parseAddClientInput(body: unknown): AddClientInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const companyName = getStringField(body, "companyName");
    const contactPerson = getStringField(body, "contactPerson");
    const email = getStringField(body, "email").toLowerCase();
    const phone = getStringField(body, "phone");
    const plan = getStringField(body, "plan") as ClientPlan;
    const monthlyFee = Number(body.monthlyFee);
    const startDate = getStringField(body, "startDate");
    const endDate = getOptionalStringField(body, "endDate");

    if (
        !companyName ||
        !contactPerson ||
        !email ||
        !phone ||
        !clientPlans.includes(plan) ||
        !Number.isFinite(monthlyFee) ||
        monthlyFee < 0 ||
        !isValidDateValue(startDate) ||
        (endDate && !isValidDateValue(endDate))
    ) {
        return null;
    }

    return {
        companyName,
        contactPerson,
        email,
        phone,
        website: getOptionalStringField(body, "website"),
        plan,
        monthlyFee,
        startDate,
        endDate,
        notes: getOptionalStringField(body, "notes"),
    };
}

export async function POST(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseAddClientInput,
        mutate: createClient,
    });
}
