import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TablePagination } from "@/components/ui/DataTable";

describe("TablePagination", () => {
    it("calls onPageChange when a page control is selected", () => {
        const onPageChange = vi.fn();

        render(
            <TablePagination
                currentPage={1}
                itemLabel="invoices"
                pageSize={5}
                renderedItemCount={5}
                totalItems={13}
                totalPages={3}
                onPageChange={onPageChange}
            />
        );

        expect(screen.getByText("Showing 1 to 5 of 13 invoices")).not.toBeNull();

        fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
        fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));

        expect(onPageChange).toHaveBeenNthCalledWith(1, 2);
        expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
    });

    it("disables controls that cannot change the page", () => {
        render(
            <TablePagination
                currentPage={3}
                itemLabel="invoices"
                pageSize={5}
                renderedItemCount={3}
                totalItems={13}
                totalPages={3}
                onPageChange={vi.fn()}
            />
        );

        const currentPageButton = screen.getByRole("button", { name: "Go to page 3" });
        const nextPageButton = screen.getByRole("button", { name: "Go to next page" });
        const previousPageButton = screen.getByRole("button", {
            name: "Go to previous page",
        });

        expect((currentPageButton as HTMLButtonElement).disabled).toBe(true);
        expect(currentPageButton.getAttribute("aria-current")).toBe("page");
        expect((nextPageButton as HTMLButtonElement).disabled).toBe(true);
        expect((previousPageButton as HTMLButtonElement).disabled).toBe(false);
    });
});
