import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { createDashboardInvoice } from "@/server/dashboard/mutations";
import type { CreateInvoiceInput } from "@/server/dashboard/types";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getStringField(body: Record<string, unknown>, fieldName: string) {
    const value = body[fieldName];

    return typeof value === "string" ? value.trim() : "";
}

function getOptionalStringField(body: Record<string, unknown>, fieldName: string) {
    const value = getStringField(body, fieldName);

    return value || undefined;
}

function formatDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(dateValue: string, amount: number) {
    const [year, month, day] = dateValue.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + amount);

    return formatDateValue(date);
}

function isDateValue(value: string) {
    const match = datePattern.exec(value);

    if (!match) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

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
        !isDateValue(issueDate) ||
        !isDateValue(dueDate) ||
        dueDate < issueDate ||
        !isDateValue(periodStart) ||
        !isDateValue(periodEnd) ||
        periodEnd !== addDays(periodStart, 30) ||
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

    const result = await createDashboardInvoice(input, session.user.id);
    if (!result.ok) {
        return NextResponse.json(
            { message: result.message || "Something went wrong!" },
            { status: 400 }
        );
    }

    return NextResponse.json(result);
}
