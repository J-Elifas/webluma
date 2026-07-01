import { ClientPlan as PrismaClientPlan } from "@prisma/client";
import { toUtcDate } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import type {
    AddClientInput,
    AddClientMutationResult,
    DeleteClientInput,
    DeleteClientMutationResult,
    UpdateClientInput,
    UpdateClientMutationResult,
} from "./types";

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

export async function deleteClient(
    input: DeleteClientInput,
    userId: string
): Promise<DeleteClientMutationResult> {
    const client = await prisma.client.findFirst({
        where: {
            id: input.clientId,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!client) {
        return {
            message: "Cannot find specific client!",
            ok: false,
        };
    }

    const deletedClient = await prisma.client.delete({
        where: {
            id: client.id,
        },
        select: {
            id: true,
        },
    });

    return {
        message: "Client deleted.",
        ok: true,
        client: {
            id: deletedClient.id,
        },
    };
}

async function findEditableClientId(input: UpdateClientInput, userId: string) {
    const client = await prisma.client.findFirst({
        where: {
            id: input.clientId,
            userId,
        },
        select: {
            id: true,
        },
    });

    return client?.id ?? null;
}

function toClientUpdateData(input: UpdateClientInput) {
    return {
        companyName: input.companyName,
        contactPerson: input.contactPerson,
        email: input.email,
        phone: input.phone,
        website: input.website ?? null,
        plan: input.plan as PrismaClientPlan,
        monthlyFee: input.monthlyFee,
        startDate: toUtcDate(input.startDate),
        endDate: input.endDate ? toUtcDate(input.endDate) : null,
        notes: input.notes ?? null,
    };
}

export async function updateClient(
    input: UpdateClientInput,
    userId: string
): Promise<UpdateClientMutationResult> {
    const clientId = await findEditableClientId(input, userId);

    if (!clientId) {
        return {
            message: "Cannot find specific client!",
            ok: false,
        };
    }

    try {
        await prisma.client.update({
            where: {
                id: clientId,
            },
            data: toClientUpdateData(input),
        });
    } catch {
        return {
            message: "Something went wrong!",
            ok: false,
        };
    }

    return {
        message: "Client updated.",
        ok: true,
        client: input,
    };
}
