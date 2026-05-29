import type {
    AddClientInput,
    AddClientMutationResult,
    CreateInvoiceInput,
    CreateInvoiceMutationResult,
} from "./types";
import { prisma } from "../db/prisma";
import { ClientPlan, InvoiceStatus } from "@prisma/client";

function toUtcDate(dateValue: string) {
    return new Date(`${dateValue}T00:00:00.000Z`);
}

function toDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getInitialInvoiceStatus(dueDate: string) {
    return dueDate < toDateValue(new Date()) ? InvoiceStatus.overdue : InvoiceStatus.pending;
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

export async function createDashboardInvoice(
    input: CreateInvoiceInput,
    userId: string
): Promise<CreateInvoiceMutationResult> {
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

    await prisma.invoice.create({
        data: {
            clientId: client.id,
            invoiceNumber: input.invoiceNumber,
            amount: input.amount,
            status: getInitialInvoiceStatus(input.dueDate),
            issueDate: toUtcDate(input.issueDate),
            dueDate: toUtcDate(input.dueDate),
            periodStart: toUtcDate(input.periodStart),
            periodEnd: toUtcDate(input.periodEnd),
            notes: input.notes,
        },
    });

    return {
        message: "Invoice created!",
        ok: true,
        invoice: input,
    };
}
