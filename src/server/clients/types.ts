export type ClientPlan = "starter" | "pro" | "enterprise";
export type ClientStatusTone = "active" | "inactive" | "lead";
export type ClientStatusFilter = "all" | ClientStatusTone;

export interface AddClientInput {
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

export interface UpdateClientInput extends AddClientInput {
    clientId: string;
}

export type AddClientFormValues = {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    plan: string;
    monthlyFee: string;
    startDate: string;
    endDate: string;
    notes: string;
};

export interface AddClientMutationResult {
    message?: string;
    ok: boolean;
    client?: AddClientInput;
}

export interface UpdateClientMutationResult {
    message?: string;
    ok: boolean;
    client?: UpdateClientInput;
}

export interface ClientRow {
    id: string;
    clientName: string;
    contactPerson: string;
    phone: string;
    email: string;
    website: string;
    plan: ClientPlan;
    planLabel: string;
    monthlyFeeValue: number;
    startDateValue: string;
    endDateValue: string;
    notes: string;
    status: ClientStatusTone;
    statusLabel: string;
    totalInvoiced: string;
    totalInvoicedValue: number;
    outstanding: string;
    outstandingValue: number;
    lastActivity: string;
    createdAtValue: string;
}

export interface ClientTableData {
    clients: ClientRow[];
    totalClients: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface ClientFilters {
    status: ClientStatusFilter;
    plan: ClientPlan | "all";
}

export interface ClientPageData {
    isGuest: boolean;
    tableData: ClientTableData;
}

export interface DeleteClientInput {
    clientId: string;
}

export interface DeleteClientMutationResult {
    message?: string;
    ok: boolean;
    client?: {
        id: string;
    };
}
