import { ClientPlan as PrismaClientPlan, InvoiceStatus, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/options";
import { prisma } from "@/server/db/prisma";
import { currencyFormatter, formatDateValue, toUtcDate, toUtcDateValue } from "@/lib/utils";
import { clientPlanLabels } from "./options";
import type {
    ClientPageData,
    ClientPlan,
    ClientRow,
    ClientStatusTone,
    ClientTableData,
} from "./types";

const maxClientPageSize = 5;
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const statusLabels: Record<ClientStatusTone, string> = {
    active: "Active",
    inactive: "Inactive",
    lead: "Lead",
};
const clientSelect = {
    id: true,
    companyName: true,
    contactPerson: true,
    phone: true,
    email: true,
    plan: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    invoices: {
        select: {
            amount: true,
            status: true,
            updatedAt: true,
        },
    },
} as const;

interface ClientRecord {
    id: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    plan: PrismaClientPlan;
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    invoices: {
        amount: Prisma.Decimal;
        status: InvoiceStatus;
        updatedAt: Date;
    }[];
}

function getEmptyClientTableData(pageSize: number): ClientTableData {
    return {
        clients: [],
        totalClients: 0,
        currentPage: 1,
        pageSize,
        totalPages: 1,
    };
}

function getClientStatus(client: Pick<ClientRecord, "endDate" | "startDate">, todayValue: string) {
    if (toUtcDateValue(client.startDate) > todayValue) {
        return "lead";
    }

    if (client.endDate && toUtcDateValue(client.endDate) < todayValue) {
        return "inactive";
    }

    return "active";
}

function getTotalInvoiced(invoices: ClientRecord["invoices"]) {
    return invoices.reduce((total, invoice) => total + Number(invoice.amount), 0);
}

function getOutstandingAmount(invoices: ClientRecord["invoices"]) {
    return invoices.reduce(
        (total, invoice) =>
            total + (invoice.status !== InvoiceStatus.paid ? Number(invoice.amount) : 0),
        0
    );
}

function getLatestInvoiceActivity(invoices: ClientRecord["invoices"]) {
    return invoices.reduce<Date | null>((latestDate, invoice) => {
        if (!latestDate || invoice.updatedAt > latestDate) {
            return invoice.updatedAt;
        }

        return latestDate;
    }, null);
}

function formatLastActivity(activityDate: Date | null, todayValue: string) {
    if (!activityDate) {
        return "Never";
    }

    const activityValue = toUtcDateValue(activityDate);
    const daysAgo = Math.max(
        0,
        Math.round(
            (toUtcDate(todayValue).getTime() - toUtcDate(activityValue).getTime()) /
                millisecondsPerDay
        )
    );

    if (daysAgo === 0) {
        return "Today";
    }

    if (daysAgo === 1) {
        return "Yesterday";
    }

    return `${daysAgo} days ago`;
}

function toClientRow(client: ClientRecord, todayValue: string): ClientRow {
    const status = getClientStatus(client, todayValue);
    const plan = client.plan as ClientPlan;
    const totalInvoicedValue = getTotalInvoiced(client.invoices);
    const outstandingValue = getOutstandingAmount(client.invoices);

    return {
        id: client.id,
        clientName: client.companyName,
        contactPerson: client.contactPerson,
        phone: client.phone,
        email: client.email,
        plan,
        planLabel: clientPlanLabels[plan],
        status,
        statusLabel: statusLabels[status],
        totalInvoiced: currencyFormatter.format(totalInvoicedValue),
        totalInvoicedValue,
        outstanding: currencyFormatter.format(outstandingValue),
        outstandingValue,
        lastActivity: formatLastActivity(getLatestInvoiceActivity(client.invoices), todayValue),
        createdAtValue: toUtcDateValue(client.createdAt),
    };
}

export async function getClientPageData(
    currentPage = 1,
    pageSize = maxClientPageSize
): Promise<ClientPageData> {
    const session = await getServerSession(authOptions);
    const isGuest = !session || session.user.role === "GUEST";
    const safePageSize = Math.min(maxClientPageSize, Math.max(1, pageSize));

    if (isGuest) {
        return {
            isGuest,
            tableData: getEmptyClientTableData(safePageSize),
        };
    }

    const clientRecords = await prisma.client.findMany({
        where: {
            userId: session.user.id,
        },
        select: clientSelect,
        orderBy: [
            {
                createdAt: "desc",
            },
            {
                companyName: "asc",
            },
        ],
    });
    const todayValue = formatDateValue(new Date());
    const clients = clientRecords.map((client) => toClientRow(client, todayValue));
    const totalClients = clients.length;
    const totalPages = Math.max(1, Math.ceil(totalClients / safePageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    return {
        isGuest,
        tableData: {
            clients,
            totalClients,
            currentPage: safeCurrentPage,
            pageSize: safePageSize,
            totalPages,
        },
    };
}
