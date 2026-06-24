import { ClientPlan as PrismaClientPlan } from "@prisma/client";
import { toUtcDate } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import type { AddClientInput, AddClientMutationResult } from "./types";

export async function createClient(
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
                plan: input.plan as PrismaClientPlan,
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
