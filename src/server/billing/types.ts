export const billingReminderDaysBeforeOptions = [1, 3, 7];

export interface BillingReminderPreferences {
    remindersEnabled: boolean;
    reminderDaysBefore: number;
}

export interface BillingInvoiceDueInsight {
    amount: string;
    count: number;
    dueByDate: string;
}

export interface BillingInvoiceOverdueInsight {
    amount: string;
    count: number;
    daysOverdue: number;
}

export interface BillingInvoiceInsights {
    dueThisWeek: BillingInvoiceDueInsight;
    overdue: BillingInvoiceOverdueInsight;
}
