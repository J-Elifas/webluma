import { InvoiceStatus, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import type { ClientPlan } from "@/server/clients/types";
import { prisma } from "@/server/db/prisma";
import { currencyFormatter, formatDateValue, formatShortDate, toUtcDateValue } from "@/lib/utils";
import type {
    BillingInvoiceRow,
    BillingInvoiceTableData,
    InvoiceClient,
    InvoiceStatusTone,
} from "./types";

const defaultInvoicePageSize = 8;
const statusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.overdue]: "Overdue",
    [InvoiceStatus.paid]: "Paid",
    [InvoiceStatus.pending]: "Pending",
};
const statusTones: Record<InvoiceStatus, InvoiceStatusTone> = {
    [InvoiceStatus.overdue]: "overdue",
    [InvoiceStatus.paid]: "paid",
    [InvoiceStatus.pending]: "pending",
};
const actionLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.overdue]: "Mark paid",
    [InvoiceStatus.paid]: "View",
    [InvoiceStatus.pending]: "Mark paid",
};
const billingInvoiceSelect = {
    id: true,
    invoiceNumber: true,
    amount: true,
    status: true,
    dueDate: true,
    periodStart: true,
    periodEnd: true,
    paidAt: true,
    paymentNotes: true,
    client: {
        select: {
            companyName: true,
        },
    },
} as const;

interface BillingInvoiceRecord {
    id: string;
    invoiceNumber: string;
    amount: Prisma.Decimal;
    status: InvoiceStatus;
    dueDate: Date;
    periodStart: Date;
    periodEnd: Date;
    paidAt: Date | null;
    paymentNotes: string | null;
    client: {
        companyName: string;
    };
}

function getCurrentInvoiceStatus(invoice: BillingInvoiceRecord, currentDateValue: string) {
    if (invoice.status === InvoiceStatus.paid) {
        return InvoiceStatus.paid;
    }

    return currentDateValue > toUtcDateValue(invoice.dueDate)
        ? InvoiceStatus.overdue
        : InvoiceStatus.pending;
}

function toBillingInvoiceRow(
    invoice: BillingInvoiceRecord,
    currentDateValue: string
): BillingInvoiceRow {
    const status = getCurrentInvoiceStatus(invoice, currentDateValue);

    return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.companyName,
        billingPeriod: `${formatShortDate(invoice.periodStart)} - ${formatShortDate(invoice.periodEnd)}`,
        amount: currencyFormatter.format(Number(invoice.amount)),
        amountValue: Number(invoice.amount),
        dueDate: formatShortDate(invoice.dueDate),
        dueDateValue: toUtcDateValue(invoice.dueDate),
        paidDate: invoice.paidAt ? toUtcDateValue(invoice.paidAt) : undefined,
        paymentNotes: invoice.paymentNotes ?? undefined,
        status: statusTones[status],
        statusLabel: statusLabels[status],
        actionLabel: actionLabels[status],
    };
}

async function getInvoiceUserId() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === "GUEST") {
        return "";
    }

    return session.user.id;
}

export async function getInvoiceClient(): Promise<InvoiceClient[]> {
    const userId = await getInvoiceUserId();

    if (!userId) {
        return [];
    }

    const clients = await prisma.client.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            companyName: true,
            contactPerson: true,
            email: true,
            phone: true,
            website: true,
            plan: true,
            monthlyFee: true,
            startDate: true,
            endDate: true,
            notes: true,
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
        id: client.id,
        companyName: client.companyName,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        website: client.website ?? undefined,
        plan: client.plan as ClientPlan,
        monthlyFee: client.monthlyFee,
        startDate: toUtcDateValue(client.startDate),
        endDate: client.endDate ? toUtcDateValue(client.endDate) : undefined,
        notes: client.notes ?? undefined,
    }));
}

export async function getBillingInvoiceTableData(
    currentPage = 1,
    pageSize = defaultInvoicePageSize
): Promise<BillingInvoiceTableData> {
    const userId = await getInvoiceUserId();
    const safePageSize = Math.max(1, pageSize);
    const safeCurrentPage = Math.max(1, currentPage);

    if (!userId) {
        return {
            invoices: [],
            totalInvoices: 0,
            currentPage: safeCurrentPage,
            pageSize: safePageSize,
            totalPages: 1,
        };
    }

    const where = {
        client: {
            userId,
        },
    };
    const [totalInvoices, invoiceRecords] = await Promise.all([
        prisma.invoice.count({
            where,
        }),
        prisma.invoice.findMany({
            where,
            select: billingInvoiceSelect,
            orderBy: [
                {
                    createdAt: "desc",
                },
                {
                    invoiceNumber: "asc",
                },
            ],
            skip: (safeCurrentPage - 1) * safePageSize,
            take: safePageSize,
        }),
    ]);
    const currentDateValue = formatDateValue(new Date());
    const invoices: BillingInvoiceRow[] = invoiceRecords.map((invoice) =>
        toBillingInvoiceRow(invoice, currentDateValue)
    );

    return {
        invoices,
        totalInvoices,
        currentPage: safeCurrentPage,
        pageSize: safePageSize,
        totalPages: Math.max(1, Math.ceil(totalInvoices / safePageSize)),
    };
}
