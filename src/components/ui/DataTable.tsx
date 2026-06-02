import type { ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps {
    children: ReactNode;
    pagination?: ReactNode;
    toolbar?: ReactNode;
}

interface TableSearchProps {
    label: string;
    placeholder: string;
}

interface TablePaginationProps {
    currentPage: number;
    itemLabel: string;
    pageSize: number;
    renderedItemCount: number;
    totalItems: number;
    totalPages: number;
}

function getPaginationItems(currentPage: number, totalPages: number) {
    if (totalPages <= 6) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "ellipsis", totalPages] as const;
    }

    if (currentPage >= totalPages - 2) {
        return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
    }

    return [1, "ellipsis", currentPage, "ellipsis", totalPages] as const;
}

export default function DataTable({
    children,
    pagination,
    toolbar,
}: DataTableProps) {
    return (
        <article className="min-w-0 overflow-hidden rounded-[1.25rem] border border-mist-gray/70 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            {toolbar ? (
                <div className="grid gap-3 border-b border-mist-gray/70 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                    {toolbar}
                </div>
            ) : null}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left">{children}</table>
            </div>

            {pagination}
        </article>
    );
}

export function TableSearch({ label, placeholder }: TableSearchProps) {
    return (
        <div
            className="flex h-10 min-w-[min(100%,16rem)] flex-1 items-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-semibold text-slate-gray shadow-sm"
            role="search"
            aria-label={label}
        >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{placeholder}</span>
        </div>
    );
}

export function TableFilterChip({ children, icon }: { children: string; icon?: ReactNode }) {
    return (
        <span className="inline-flex h-10 min-w-[8.5rem] flex-1 items-center justify-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-semibold text-midnight-slate shadow-sm sm:flex-none">
            {icon}
            <span className="truncate">{children}</span>
            <ChevronDown className="h-4 w-4 text-slate-gray" aria-hidden="true" />
        </span>
    );
}

export function TablePagination({
    currentPage,
    itemLabel,
    pageSize,
    renderedItemCount,
    totalItems,
    totalPages,
}: TablePaginationProps) {
    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = totalItems > 0 ? startItem + renderedItemCount - 1 : 0;
    const pageItems = getPaginationItems(currentPage, totalPages);

    return (
        <div className="flex flex-col gap-3 border-t border-mist-gray/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-gray">
                Showing {startItem} to {endItem} of {totalItems} {itemLabel}
            </p>
            <div className="flex items-center gap-2" aria-label="Pagination preview">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </span>
                {pageItems.map((item, index) =>
                    item === "ellipsis" ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="inline-flex h-9 w-9 items-center justify-center text-sm font-black text-slate-gray"
                        >
                            ...
                        </span>
                    ) : (
                        <span
                            key={item}
                            className={
                                item === currentPage
                                    ? "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-luma-blue text-sm font-semibold text-white shadow-[0_14px_24px_-18px_rgba(56,189,248,0.9)]"
                                    : "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-sm font-semibold text-midnight-slate shadow-sm"
                            }
                        >
                            {item}
                        </span>
                    )
                )}
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm">
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
            </div>
        </div>
    );
}
