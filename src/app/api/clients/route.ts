import { getOptionalStringField, getStringField, isRecord, isValidDateValue } from "@/lib/utils";
import { handleAuthenticatedJsonRequest } from "@/server/api/authenticated-json-handler";
import { createClient, deleteClient, updateClient } from "@/server/clients/mutations";
import { clientPlans } from "@/server/clients/options";
import type {
    AddClientInput,
    ClientPlan,
    DeleteClientInput,
    UpdateClientInput,
} from "@/server/clients/types";

function hasRequiredClientText(input: AddClientInput) {
    return [input.companyName, input.contactPerson, input.email, input.phone].every(Boolean);
}

function hasValidClientPlan(input: AddClientInput) {
    return clientPlans.includes(input.plan);
}

function hasValidMonthlyFee(input: AddClientInput) {
    return Number.isFinite(input.monthlyFee) && input.monthlyFee >= 0;
}

function hasValidClientDates(input: AddClientInput) {
    if (!isValidDateValue(input.startDate)) {
        return false;
    }

    if (!input.endDate) {
        return true;
    }

    return isValidDateValue(input.endDate) && input.endDate >= input.startDate;
}

function hasValidClientDetails(input: AddClientInput) {
    return [
        hasRequiredClientText(input),
        hasValidClientPlan(input),
        hasValidMonthlyFee(input),
        hasValidClientDates(input),
    ].every(Boolean);
}

function parseClientDetailsInput(body: unknown): AddClientInput | null {
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
    const input = {
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

    return hasValidClientDetails(input) ? input : null;
}

function parseAddClientInput(body: unknown): AddClientInput | null {
    return parseClientDetailsInput(body);
}

function parseUpdateClientInput(body: unknown): UpdateClientInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const clientId = getStringField(body, "clientId");
    const clientDetails = parseClientDetailsInput(body);

    if (!clientId || !clientDetails) {
        return null;
    }

    return {
        ...clientDetails,
        clientId,
    };
}

function parseDeleteClientInput(body: unknown): DeleteClientInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const clientId = getStringField(body, "clientId");

    if (!clientId) {
        return null;
    }

    return {
        clientId,
    };
}

export async function POST(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseAddClientInput,
        mutate: createClient,
    });
}

export async function PATCH(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseUpdateClientInput,
        mutate: updateClient,
    });
}

export async function DELETE(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseDeleteClientInput,
        mutate: deleteClient,
    });
}
