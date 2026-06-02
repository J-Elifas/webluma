import type { ClientPlan } from "@/server/clients/types";

export type InvoiceStatusTone = "paid" | "pending" | "overdue";

export interface InvoiceClient {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    website?: string;
    plan: ClientPlan;
    monthlyFee: number;
    startDate: string;
    endDate?: string;
    notes?: string;
}

export interface BillingInvoiceRow {
    id: string;
    invoiceNumber: string;
    clientName: string;
    billingPeriod: string;
    amount: string;
    dueDate: string;
    status: InvoiceStatusTone;
    statusLabel: string;
    actionLabel: string;
}

export interface BillingInvoiceTableData {
    invoices: BillingInvoiceRow[];
    totalInvoices: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateInvoiceInput {
    clientId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    periodStart: string;
    periodEnd: string;
    amount: number;
    notes?: string;
}

export interface CreateInvoiceFormValues {
    clientId: string;
    plan: string;
    monthlyFee: string;
    clientEmail: string;
    periodStart: string;
    periodEnd: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    notes: string;
}

export type CreateInvoiceFormErrors = Partial<Record<keyof CreateInvoiceFormValues, string>>;

export interface CreateInvoiceMutationResult {
    message?: string;
    ok: boolean;
    invoice?: CreateInvoiceInput;
}
