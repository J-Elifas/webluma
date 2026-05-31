import type { AddClientInput, AddClientMutationResult } from "./types";
import { prisma } from "../db/prisma";
import { ClientPlan } from "@prisma/client";
import { toUtcDate } from "@/lib/utils";

export async function createDashboardClient(
    input: AddClientInput,
    userId: string
): Promise<AddClientMutationResult> {
    try {
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
    } catch {
        return {
            message: "Something went wrong!",
            ok: false,
        };
    }

    return {
        message: "Client created!",
        ok: true,
        client: input,
    };
}
