"use client";

import type { StatusAlertTone } from "@/components/ui/StatusAlert";

interface TableExportStatus {
    tone: StatusAlertTone;
    title: string;
    message: string;
}

interface TableExportOptions<TRow> {
    errorStatus: TableExportStatus;
    fileNamePrefix: string;
    getRows: (rows: TRow[]) => (number | string)[][];
    headers: readonly string[];
    onStatusChange: (status: TableExportStatus) => void;
    rows: TRow[];
    sheetName: string;
}

export default function useTableExport<TRow>({
    errorStatus,
    fileNamePrefix,
    getRows,
    headers,
    onStatusChange,
    rows,
    sheetName,
}: TableExportOptions<TRow>) {
    async function handleExport() {
        try {
            const XLSX = await import("xlsx");
            const worksheet = XLSX.utils.aoa_to_sheet([[...headers], ...getRows(rows)]);
            const workbook = XLSX.utils.book_new();
            const exportDate = new Date().toISOString().slice(0, 10);

            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            XLSX.writeFile(workbook, `${fileNamePrefix}-${exportDate}.xlsx`, {
                compression: true,
            });
        } catch {
            onStatusChange(errorStatus);
        }
    }

    return {
        handleExport,
    };
}
