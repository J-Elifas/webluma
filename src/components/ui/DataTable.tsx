import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface DataTableProps {
    children: ReactNode;
    pagination?: ReactNode;
    toolbar?: ReactNode;
}

interface TableSearchProps {
    label: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    value: string;
}

interface TablePaginationProps {
    currentPage: number;
    itemLabel: string;
    onPageChange?: (page: number) => void;
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

export default function DataTable({ children, pagination, toolbar }: DataTableProps) {
    return (
        <article className="min-w-0 overflow-hidden rounded-[1.25rem] border border-mist-gray/70 bg-white shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            {toolbar ? (
                <div className="relative z-20 grid gap-3 overflow-visible border-b border-mist-gray/70 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                    {toolbar}
                </div>
            ) : null}

            <div className="relative z-0 overflow-x-auto">
                <table className="w-full min-w-[880px] text-left">{children}</table>
            </div>

            {pagination}
        </article>
    );
}

export function TableSearch({ label, onValueChange, placeholder, value }: TableSearchProps) {
    return (
        <div
            className="flex h-10 min-w-[min(100%,16rem)] flex-1 items-center gap-2 rounded-xl border border-mist-gray/70 bg-white px-3 text-sm font-semibold text-slate-gray shadow-sm transition-[border-color,box-shadow] duration-150 focus-within:border-luma-blue focus-within:ring-2 focus-within:ring-luma-blue/25"
            role="search"
        >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
                type="search"
                aria-label={label}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onValueChange(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-midnight-slate placeholder:text-slate-gray focus:outline-none"
            />
        </div>
    );
}

export function TablePagination({
    currentPage,
    itemLabel,
    onPageChange,
    pageSize,
    renderedItemCount,
    totalItems,
    totalPages,
}: TablePaginationProps) {
    const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = totalItems > 0 ? startItem + renderedItemCount - 1 : 0;
    const pageItems = getPaginationItems(currentPage, totalPages);
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    function handlePageChange(page: number) {
        if (!onPageChange || page < 1 || page > totalPages || page === currentPage) {
            return;
        }

        onPageChange(page);
    }

    return (
        <div className="flex flex-col gap-3 border-t border-mist-gray/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-gray">
                Showing {startItem} to {endItem} of {totalItems} {itemLabel}
            </p>
            <nav className="flex items-center gap-2" aria-label="Pagination">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Go to previous page"
                    disabled={!onPageChange || !canGoPrevious}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm transition-colors hover:border-luma-blue/60 hover:bg-white hover:text-luma-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                {pageItems.map((item, index) =>
                    item === "ellipsis" ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="inline-flex h-9 w-9 items-center justify-center text-sm font-black text-slate-gray"
                        >
                            ...
                        </span>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            key={item}
                            aria-label={`Go to page ${item}`}
                            aria-current={item === currentPage ? "page" : undefined}
                            disabled={!onPageChange || item === currentPage}
                            onClick={() => handlePageChange(item)}
                            className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-colors disabled:cursor-default",
                                item === currentPage
                                    ? "bg-luma-blue text-white shadow-[0_14px_24px_-18px_rgba(56,189,248,0.9)] hover:bg-luma-blue disabled:text-white disabled:opacity-100 disabled:shadow-[0_14px_24px_-18px_rgba(56,189,248,0.9)]"
                                    : "border border-mist-gray/70 bg-white text-midnight-slate shadow-sm hover:border-luma-blue/60 hover:bg-white hover:text-luma-blue disabled:shadow-sm",
                                !onPageChange &&
                                    item !== currentPage &&
                                    "opacity-50 disabled:opacity-50"
                            )}
                        >
                            {item}
                        </Button>
                    )
                )}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Go to next page"
                    disabled={!onPageChange || !canGoNext}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm transition-colors hover:border-luma-blue/60 hover:bg-white hover:text-luma-blue disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
            </nav>
        </div>
    );
}
