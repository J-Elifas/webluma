import { InvoiceStatus } from "@prisma/client";
import { formatDateValue, toUtcDate, toUtcDateValue } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import type { CreateInvoiceInput, CreateInvoiceMutationResult } from "./types";

const activeInvoiceStatuses = [InvoiceStatus.pending, InvoiceStatus.overdue];

function getInitialInvoiceStatus(dueDate: string) {
    return dueDate < formatDateValue(new Date()) ? InvoiceStatus.overdue : InvoiceStatus.pending;
}

export async function createInvoice(
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

    const periodStart = toUtcDate(input.periodStart);
    const periodEnd = toUtcDate(input.periodEnd);
    const overlappingInvoice = await prisma.invoice.findFirst({
        where: {
            clientId: client.id,
            status: {
                in: activeInvoiceStatuses,
            },
            periodStart: {
                lte: periodEnd,
            },
            periodEnd: {
                gte: periodStart,
            },
        },
        select: {
            invoiceNumber: true,
            periodStart: true,
            periodEnd: true,
        },
        orderBy: {
            periodEnd: "desc",
        },
    });

    if (overlappingInvoice) {
        const existingStart = toUtcDateValue(overlappingInvoice.periodStart);
        const existingEnd = toUtcDateValue(overlappingInvoice.periodEnd);

        return {
            message: `This client already has an active invoice (${overlappingInvoice.invoiceNumber}) for ${existingStart} to ${existingEnd}. Start the next invoice after ${existingEnd}.`,
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
            periodStart,
            periodEnd,
            notes: input.notes,
        },
    });

    return {
        message: "Invoice created!",
        ok: true,
        invoice: input,
    };
}
