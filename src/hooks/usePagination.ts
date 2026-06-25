"use client";

import { useState } from "react";

export default function usePagination(totalItems: number, pageSize: number) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageStartIndex = (safeCurrentPage - 1) * pageSize;

    function resetPage() {
        setCurrentPage(1);
    }

    function handlePageChange(page: number) {
        setCurrentPage(Math.min(Math.max(1, page), totalPages));
    }

    return {
        currentPage: safeCurrentPage,
        pageStartIndex,
        totalPages,
        handlePageChange,
        resetPage,
    };
}
