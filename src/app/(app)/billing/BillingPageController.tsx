"use client";

import { useState } from "react";
import BillingContent from "@/components/billing/BillingContent";
import ReminderSettingsModal from "@/components/billing/ReminderSettingsModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StatusAlert from "@/components/ui/StatusAlert";
import useBillingFilters from "@/hooks/billing/useBillingFilters";
import useBillingModals from "@/hooks/billing/useBillingModals";
import useBillingReminderSettings from "@/hooks/billing/useBillingReminderSettings";
import useInvoiceExport from "@/hooks/billing/useInvoiceExport";
import useRouteNavigationLoading from "@/hooks/useRouteNavigationLoading";
import useStatusAlert from "@/hooks/useStatusAlert";
import type { BillingInvoiceInsights, BillingReminderPreferences } from "@/server/billing/types";
import type { BillingInvoiceTableData, InvoiceClient } from "@/server/invoices/types";
import MarkInvoicePaidController from "./MarkInvoicePaidController";
import CreateInvoiceController from "../invoices/CreateInvoiceController";

interface BillingPageControllerProps {
    invoiceClient: InvoiceClient[];
    invoiceInsights: BillingInvoiceInsights;
    invoiceTableData: BillingInvoiceTableData;
    isGuest: boolean;
    reminderPreferences: BillingReminderPreferences;
}

export default function BillingPageController({
    invoiceClient,
    invoiceInsights,
    invoiceTableData,
    isGuest,
    reminderPreferences,
}: BillingPageControllerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { alert, setAlert, showStatusAlert } = useStatusAlert();
    const handleRouteNavigate = useRouteNavigationLoading();
    const billingFilters = useBillingFilters(invoiceTableData);
    const billingModals = useBillingModals();
    const invoiceExport = useInvoiceExport(billingFilters.filteredInvoices, showStatusAlert);
    const reminderSettings = useBillingReminderSettings({
        initialReminderPreferences: reminderPreferences,
        invoices: invoiceTableData.invoices,
        isGuest,
        onStatusChange: showStatusAlert,
    });
    const isSaving = isLoading || reminderSettings.isSavingReminderSettings;
    const loadingLabel = reminderSettings.isSavingReminderSettings
        ? "Saving reminder settings"
        : "Saving invoice";

    return (
        <>
            <BillingContent
                filteredInvoiceTableData={billingFilters.filteredInvoiceTableData}
                invoiceClients={invoiceClient}
                invoiceFilters={billingFilters.invoiceFilters}
                invoiceInsights={invoiceInsights}
                invoiceSearchQuery={billingFilters.invoiceSearchQuery}
                invoiceTableData={invoiceTableData}
                isGuest={isGuest}
                nextPaymentReminder={reminderSettings.nextPaymentReminder}
                reminderPreferences={reminderSettings.savedReminderPreferences}
                onCreateInvoice={billingModals.handleCreateInvoiceSelect}
                onInvoiceExport={invoiceExport.handleInvoiceExport}
                onInvoiceAction={billingModals.handleInvoiceActionSelect}
                onInvoiceFiltersChange={billingFilters.handleInvoiceFiltersChange}
                onInvoicePageChange={billingFilters.handleInvoicePageChange}
                onInvoiceSearchQueryChange={billingFilters.handleInvoiceSearchQueryChange}
                onManageReminders={reminderSettings.handleReminderSettingsOpen}
                onRouteNavigate={handleRouteNavigate}
            />

            {alert ? (
                <StatusAlert
                    key={alert.id}
                    tone={alert.tone}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => setAlert(null)}
                />
            ) : null}

            <CreateInvoiceController
                clients={invoiceClient}
                isOpen={billingModals.isCreateInvoiceOpen}
                onClose={billingModals.handleCreateInvoiceClose}
                onPendingChange={setIsLoading}
                onStatusChange={showStatusAlert}
            />

            <MarkInvoicePaidController
                key={billingModals.selectedInvoice?.id ?? "invoice-payment"}
                invoice={billingModals.selectedInvoice}
                isOpen={billingModals.isMarkPaidOpen}
                onClose={billingModals.handleMarkInvoicePaidClose}
                onAfterClose={billingModals.handleMarkInvoicePaidAfterClose}
                onPendingChange={setIsLoading}
                onStatusChange={showStatusAlert}
            />

            <ReminderSettingsModal
                isOpen={reminderSettings.isReminderSettingsOpen}
                isSubmitting={reminderSettings.isSavingReminderSettings}
                preferences={reminderSettings.draftReminderPreferences}
                onAfterClose={reminderSettings.handleReminderSettingsAfterClose}
                onCancel={reminderSettings.handleReminderSettingsClose}
                onClose={reminderSettings.handleReminderSettingsClose}
                onReminderDaysBeforeChange={reminderSettings.handleReminderDaysBeforeChange}
                onReminderEnabledChange={reminderSettings.handleReminderEnabledChange}
                onSubmit={reminderSettings.handleReminderSettingsSubmit}
            />

            <LoadingSpinner isVisible={isSaving} label={loadingLabel} fullscreen />
        </>
    );
}
