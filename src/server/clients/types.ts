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

type AddClientFormTextValues = {
    [FieldName in keyof AddClientInput]-?: string;
};

export type AddClientFormValues = Omit<AddClientFormTextValues, "plan"> & {
    plan: AddClientInput["plan"] | "";
};

export type AddClientFormErrors = Partial<Record<keyof AddClientFormValues, string>>;

export interface AddClientMutationResult {
    message?: string;
    ok: boolean;
    client?: AddClientInput;
}

export interface ClientRow {
    id: string;
    clientName: string;
    contactPerson: string;
    phone: string;
    email: string;
    plan: ClientPlan;
    planLabel: string;
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
