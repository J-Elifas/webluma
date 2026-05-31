import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import type { ClientPlan } from "@/server/clients/types";
import { prisma } from "@/server/db/prisma";
import type { InvoiceClientOption } from "./types";

export async function getInvoiceClientOptions(): Promise<InvoiceClientOption[]> {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === "GUEST") {
        return [];
    }

    const clients = await prisma.client.findMany({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
            companyName: true,
            email: true,
            plan: true,
            monthlyFee: true,
        },
        orderBy: [
            {
                companyName: "asc",
            },
            {
                createdAt: "desc",
            },
        ],
    });

    return clients.map((client) => ({
        ...client,
        plan: client.plan as ClientPlan,
    }));
}
