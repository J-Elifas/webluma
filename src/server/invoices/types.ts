export type InvoiceClientPlan = "starter" | "pro" | "enterprise";

export interface InvoiceClientOption {
    id: string;
    companyName: string;
    email: string;
    plan: InvoiceClientPlan;
    monthlyFee: number;
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
