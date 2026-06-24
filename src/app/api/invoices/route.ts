import {
    addDaysToDateValue,
    getOptionalStringField,
    getStringField,
    isRecord,
    isValidDateValue,
} from "@/lib/utils";
import { handleAuthenticatedJsonRequest } from "@/server/api/authenticated-json-handler";
import { createInvoice, deleteInvoicePayment, markInvoicePaid } from "@/server/invoices/mutations";
import type {
    CreateInvoiceInput,
    DeleteInvoicePaymentInput,
    MarkInvoicePaidInput,
} from "@/server/invoices/types";

function parseCreateInvoiceInput(body: unknown): CreateInvoiceInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const clientId = getStringField(body, "clientId");
    const invoiceNumber = getStringField(body, "invoiceNumber");
    const issueDate = getStringField(body, "issueDate");
    const dueDate = getStringField(body, "dueDate");
    const periodStart = getStringField(body, "periodStart");
    const periodEnd = getStringField(body, "periodEnd");
    const amount = Number(body.amount);

    if (
        !clientId ||
        !invoiceNumber ||
        !isValidDateValue(issueDate) ||
        !isValidDateValue(dueDate) ||
        dueDate < issueDate ||
        !isValidDateValue(periodStart) ||
        !isValidDateValue(periodEnd) ||
        periodEnd !== addDaysToDateValue(periodStart, 30) ||
        !Number.isFinite(amount) ||
        amount < 0
    ) {
        return null;
    }

    return {
        clientId,
        invoiceNumber,
        issueDate,
        dueDate,
        periodStart,
        periodEnd,
        amount,
        notes: getOptionalStringField(body, "notes"),
    };
}

function parseMarkInvoicePaidInput(body: unknown): MarkInvoicePaidInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const invoiceId = getStringField(body, "invoiceId");
    const paidDate = getStringField(body, "paidDate");

    if (!invoiceId || !isValidDateValue(paidDate)) {
        return null;
    }

    return {
        invoiceId,
        paidDate,
        notes: getOptionalStringField(body, "notes"),
    };
}

function parseDeleteInvoicePaymentInput(body: unknown): DeleteInvoicePaymentInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const invoiceId = getStringField(body, "invoiceId");

    if (!invoiceId) {
        return null;
    }

    return {
        invoiceId,
    };
}

export async function POST(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseCreateInvoiceInput,
        mutate: createInvoice,
    });
}

export async function PATCH(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseMarkInvoicePaidInput,
        mutate: markInvoicePaid,
    });
}

export async function DELETE(request: Request) {
    return handleAuthenticatedJsonRequest({
        request,
        parseInput: parseDeleteInvoicePaymentInput,
        mutate: deleteInvoicePayment,
    });
}
