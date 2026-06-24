import { render, screen, act, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Modal from "@/components/ui/Modal";

function renderModal({
    children = "Modal content",
    isOpen = true,
    onAfterClose = vi.fn(),
    onClose = vi.fn(),
    title = "Test modal",
}: Partial<Parameters<typeof Modal>[0]> = {}) {
    return render(
        <Modal isOpen={isOpen} title={title} onClose={onClose} onAfterClose={onAfterClose}>
            {children}
        </Modal>
    );
}

describe("Modal", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        document.body.style.overflow = "";
        vi.useRealTimers();
    });

    it("keeps the modal mounted until the close animation finishes", () => {
        const onAfterClose = vi.fn();
        const { rerender } = renderModal({ onAfterClose });

        expect(screen.queryByRole("dialog", { name: "Test modal" })).not.toBeNull();

        rerender(
            <Modal isOpen={false} title="Test modal" onClose={vi.fn()} onAfterClose={onAfterClose}>
                Modal content
            </Modal>
        );

        expect(screen.queryByRole("dialog", { name: "Test modal" })).not.toBeNull();
        expect(onAfterClose).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(166);
        });

        expect(screen.queryByRole("dialog", { name: "Test modal" })).toBeNull();
        expect(onAfterClose).toHaveBeenCalledTimes(1);
    });

    it("keeps body scroll locked while the modal is closing", () => {
        const { rerender } = renderModal();

        expect(document.body.style.overflow).toBe("hidden");

        rerender(
            <Modal isOpen={false} title="Test modal" onClose={vi.fn()}>
                Modal content
            </Modal>
        );

        expect(document.body.style.overflow).toBe("hidden");

        act(() => {
            vi.advanceTimersByTime(166);
        });

        expect(document.body.style.overflow).toBe("");
    });

    it("makes the dialog inert while the modal is closing", () => {
        const { rerender } = renderModal();

        rerender(
            <Modal isOpen={false} title="Test modal" onClose={vi.fn()}>
                Modal content
            </Modal>
        );

        const dialog = screen.getByRole("dialog", { name: "Test modal" });

        expect(dialog.getAttribute("inert")).not.toBeNull();
        expect(dialog.className).toContain("pointer-events-none");
    });

    it("calls onClose when Escape is pressed while open", () => {
        const onClose = vi.fn();
        renderModal({ onClose });

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
