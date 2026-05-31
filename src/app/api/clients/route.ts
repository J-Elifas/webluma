import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { getOptionalStringField, getStringField, isRecord, isValidDateValue } from "@/lib/utils";
import { createClient } from "@/server/clients/mutations";
import { clientPlans } from "@/server/clients/options";
import type { AddClientInput, ClientPlan } from "@/server/clients/types";

function parseAddClientInput(body: unknown): AddClientInput | null {
    if (!isRecord(body)) {
        return null;
    }

    const companyName = getStringField(body, "companyName");
    const contactPerson = getStringField(body, "contactPerson");
    const email = getStringField(body, "email").toLowerCase();
    const phone = getStringField(body, "phone");
    const plan = getStringField(body, "plan") as ClientPlan;
    const monthlyFee = Number(body.monthlyFee);
    const startDate = getStringField(body, "startDate");
    const endDate = getOptionalStringField(body, "endDate");

    if (
        !companyName ||
        !contactPerson ||
        !email ||
        !phone ||
        !clientPlans.includes(plan) ||
        !Number.isFinite(monthlyFee) ||
        monthlyFee < 0 ||
        !isValidDateValue(startDate) ||
        (endDate && !isValidDateValue(endDate))
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

    const result = await createClient(input, session.user.id);
    if (!result.ok) {
        return NextResponse.json(
            { message: result.message || "Something went wrong!" },
            { status: 400 }
        );
    }

    return NextResponse.json(result);
}
