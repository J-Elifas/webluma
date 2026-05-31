import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { createDashboardClient } from "@/server/dashboard/mutations";
import type { AddClientInput, DashboardClientPlan } from "@/server/dashboard/types";

const dashboardClientPlans: DashboardClientPlan[] = ["starter", "pro", "enterprise"];
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

function parseAddClientInput(body: unknown): AddClientInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const companyName = getStringField(body, "companyName");
    const contactPerson = getStringField(body, "contactPerson");
    const email = getStringField(body, "email").toLowerCase();
    const phone = getStringField(body, "phone");
    const plan = getStringField(body, "plan") as DashboardClientPlan;
    const monthlyFee = Number(body.monthlyFee);
    const startDate = getStringField(body, "startDate");
    const endDate = getOptionalStringField(body, "endDate");

    if (
        !companyName ||
        !contactPerson ||
        !email ||
        !phone ||
        !dashboardClientPlans.includes(plan) ||
        !Number.isFinite(monthlyFee) ||
        monthlyFee < 0 ||
        !isDateValue(startDate) ||
        (endDate && !isDateValue(endDate))
    ) {
        return null;
    }

    return {
        companyName,
        contactPerson,
        email,
        phone,
        website: getOptionalStringField(body, "website"),
        plan,
        monthlyFee,
        startDate,
        endDate,
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

    const input = parseAddClientInput(body);
    if (!input) {
        return NextResponse.json({ message: "Input required!" }, { status: 400 });
    }

    const result = await createDashboardClient(input, session.user.id);
    if (!result.ok) {
        return NextResponse.json(
            { message: result.message || "Something went wrong!" },
            { status: 400 }
        );
    }

    return NextResponse.json(result);
}
