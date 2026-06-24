import type { ClientPlan } from "@/server/clients/types";

export type InvoiceStatusTone = "paid" | "pending" | "overdue";
export type BillingInvoiceStatusFilter = "all" | InvoiceStatusTone;

export interface InvoiceClientBillingPeriod {
    invoiceNumber: string;
    periodStart: string;
    periodEnd: string;
}

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
    latestInvoicePeriod?: InvoiceClientBillingPeriod;
}

export interface BillingInvoiceRow {
    id: string;
    invoiceNumber: string;
    clientId: string;
    clientName: string;
    billingPeriod: string;
    amount: string;
    amountValue: number;
    dueDate: string;
    dueDateValue: string;
    paidDate?: string;
    paymentNotes?: string;
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

export interface BillingInvoiceFilters {
    status: BillingInvoiceStatusFilter;
    clientId: string;
    dueDateStart: string;
    dueDateEnd: string;
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

export interface MarkInvoicePaidInput {
    invoiceId: string;
    paidDate: string;
    notes?: string;
}

export interface MarkInvoicePaidFormValues {
    paidDate: string;
    notes: string;
}

export type MarkInvoicePaidFormErrors = Partial<Record<keyof MarkInvoicePaidFormValues, string>>;

export interface MarkInvoicePaidMutationResult {
    message?: string;
    ok: boolean;
    invoice?: {
        id: string;
        paidDate: string;
        paymentNotes?: string;
    };
}

export interface DeleteInvoicePaymentInput {
    invoiceId: string;
}

export interface DeleteInvoicePaymentMutationResult {
    message?: string;
    ok: boolean;
    invoice?: {
        id: string;
    };
}
