import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import {
    addDaysToDateValue,
    getOptionalStringField,
    getStringField,
    isRecord,
    isValidDateValue,
} from "@/lib/utils";
import { createInvoice } from "@/server/invoices/mutations";
import type { CreateInvoiceInput } from "@/server/invoices/types";

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

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === "GUEST") {
        return NextResponse.json({ message: "You are not authenticate!" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: "Unknown data!" }, { status: 400 });
    }

    const input = parseCreateInvoiceInput(body);
    if (!input) {
        return NextResponse.json({ message: "Input required!" }, { status: 400 });
    }

    const result = await createInvoice(input, session.user.id);
    if (!result.ok) {
        return NextResponse.json(
            { message: result.message || "Something went wrong!" },
            { status: 400 }
        );
    }

    return NextResponse.json(result);
}
