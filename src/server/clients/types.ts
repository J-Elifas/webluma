export type ClientPlan = "starter" | "pro" | "enterprise";

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
