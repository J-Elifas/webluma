import { InvoiceStatus } from "@prisma/client";
import {
    addDaysToDateValue,
    formatDate,
    formatDateValue,
    toUtcDate,
    toUtcDateValue,
} from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import type {
    CreateInvoiceInput,
    CreateInvoiceMutationResult,
    DeleteInvoicePaymentInput,
    DeleteInvoicePaymentMutationResult,
    MarkInvoicePaidInput,
    MarkInvoicePaidMutationResult,
} from "./types";

interface InvoiceOverlapInput {
    clientId: string;
    excludedInvoiceId?: string;
    periodEnd: Date;
    periodStart: Date;
}

function getOpenInvoiceStatus(dueDate: string) {
    return dueDate < formatDateValue(new Date()) ? InvoiceStatus.overdue : InvoiceStatus.pending;
}

function getOverlappingInvoiceMessage(overlappingInvoice: {
    invoiceNumber: string;
    periodEnd: Date;
    periodStart: Date;
}) {
    const existingStart = formatDate(overlappingInvoice.periodStart);
    const existingEnd = formatDate(overlappingInvoice.periodEnd);

    return `This client already has an invoice (${overlappingInvoice.invoiceNumber}) for ${existingStart} to ${existingEnd}. Start the next invoice after ${existingEnd}.`;
}

function getLatestInvoicePeriodMessage(latestInvoicePeriod: {
    invoiceNumber: string;
    periodEnd: Date;
}) {
    const existingEnd = formatDate(latestInvoicePeriod.periodEnd);
    const nextStartDate = toUtcDate(
        addDaysToDateValue(toUtcDateValue(latestInvoicePeriod.periodEnd), 1)
    );

    return `This client already has an invoice (${latestInvoicePeriod.invoiceNumber}) through ${existingEnd}. Start the next invoice on or after ${formatDate(nextStartDate)}.`;
}

async function findLatestInvoicePeriod(clientId: string) {
    return prisma.invoice.findFirst({
        where: {
            clientId,
        },
        select: {
            invoiceNumber: true,
            periodEnd: true,
        },
        orderBy: {
            periodEnd: "desc",
        },
    });
}

async function findOverlappingInvoice({
    clientId,
    excludedInvoiceId,
    periodEnd,
    periodStart,
}: InvoiceOverlapInput) {
    return prisma.invoice.findFirst({
        where: {
            id: excludedInvoiceId ? { not: excludedInvoiceId } : undefined,
            clientId,
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
    const latestInvoicePeriod = await findLatestInvoicePeriod(client.id);

    if (latestInvoicePeriod && periodStart <= latestInvoicePeriod.periodEnd) {
        return {
            message: getLatestInvoicePeriodMessage(latestInvoicePeriod),
            ok: false,
        };
    }

    await prisma.invoice.create({
        data: {
            clientId: client.id,
            invoiceNumber: input.invoiceNumber,
            amount: input.amount,
            status: getOpenInvoiceStatus(input.dueDate),
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

export async function markInvoicePaid(
    input: MarkInvoicePaidInput,
    userId: string
): Promise<MarkInvoicePaidMutationResult> {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: input.invoiceId,
            client: {
                userId,
            },
        },
        select: {
            id: true,
        },
    });

    if (!invoice) {
        return {
            message: "Cannot find specific invoice!",
            ok: false,
        };
    }

    const updatedInvoice = await prisma.invoice.update({
        where: {
            id: invoice.id,
        },
        data: {
            paidAt: toUtcDate(input.paidDate),
            paymentNotes: input.notes ?? null,
            status: InvoiceStatus.paid,
        },
        select: {
            id: true,
            paidAt: true,
            paymentNotes: true,
        },
    });

    return {
        message: "Payment marked complete.",
        ok: true,
        invoice: {
            id: updatedInvoice.id,
            paidDate: updatedInvoice.paidAt
                ? toUtcDateValue(updatedInvoice.paidAt)
                : input.paidDate,
            paymentNotes: updatedInvoice.paymentNotes ?? undefined,
        },
    };
}

export async function deleteInvoicePayment(
    input: DeleteInvoicePaymentInput,
    userId: string
): Promise<DeleteInvoicePaymentMutationResult> {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: input.invoiceId,
            client: {
                userId,
            },
        },
        select: {
            id: true,
            clientId: true,
            dueDate: true,
            periodStart: true,
            periodEnd: true,
            status: true,
        },
    });

    if (!invoice) {
        return {
            message: "Cannot find specific invoice!",
            ok: false,
        };
    }

    if (invoice.status !== InvoiceStatus.paid) {
        return {
            message: "This invoice does not have a paid status to delete.",
            ok: false,
        };
    }

    const overlappingInvoice = await findOverlappingInvoice({
        clientId: invoice.clientId,
        excludedInvoiceId: invoice.id,
        periodEnd: invoice.periodEnd,
        periodStart: invoice.periodStart,
    });

    if (overlappingInvoice) {
        return {
            message: getOverlappingInvoiceMessage(overlappingInvoice),
            ok: false,
        };
    }

    const updatedInvoice = await prisma.invoice.update({
        where: {
            id: invoice.id,
        },
        data: {
            paidAt: null,
            paymentNotes: null,
            status: getOpenInvoiceStatus(toUtcDateValue(invoice.dueDate)),
        },
        select: {
            id: true,
        },
    });

    return {
        message: "Paid status deleted.",
        ok: true,
        invoice: {
            id: updatedInvoice.id,
        },
    };
}
