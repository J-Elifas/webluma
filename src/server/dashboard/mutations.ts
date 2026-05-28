import type { AddClientInput, AddClientMutationResult } from "./types";
import { prisma } from "../db/prisma";
import { ClientPlan } from "@prisma/client";

function toUtcDate(dateValue: string) {
    return new Date(`${dateValue}T00:00:00.000Z`);
}

export async function createDashboardClient(
    input: AddClientInput,
    userId: string
): Promise<AddClientMutationResult> {
    await prisma.client.create({
        data: {
            userId,
            companyName: input.companyName,
            contactPerson: input.contactPerson,
            email: input.email,
            phone: input.phone,
            website: input.website,
            plan: input.plan as ClientPlan,
            monthlyFee: input.monthlyFee,
            startDate: toUtcDate(input.startDate),
            endDate: input.endDate ? toUtcDate(input.endDate) : undefined,
            notes: input.notes,
        },
    });

    return {
        ok: true,
        client: input,
    };
}
