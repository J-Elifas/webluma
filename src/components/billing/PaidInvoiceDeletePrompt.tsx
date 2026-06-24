"use client";

import { createPortal } from "react-dom";
import type { CSSProperties, RefObject } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PaidInvoiceDeletePromptProps {
    id: string;
    isDeleting: boolean;
    isOpen: boolean;
    isRendered: boolean;
    promptRef: RefObject<HTMLDivElement | null>;
    style: CSSProperties;
    onDelete: () => void;
    onHidden: () => void;
}

function PromptActions({
    isDeleting,
    onDelete,
}: Pick<PaidInvoiceDeletePromptProps, "isDeleting" | "onDelete">) {
    return (
        <div className="w-28">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={onDelete}
                leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
                className="h-8 w-full justify-start rounded-lg border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
        </div>
    );
}

export default function PaidInvoiceDeletePrompt({
    id,
    isDeleting,
    isOpen,
    isRendered,
    promptRef,
    style,
    onDelete,
    onHidden,
}: PaidInvoiceDeletePromptProps) {
    if (!isRendered) {
        return null;
    }

    return createPortal(
        <div
            ref={promptRef}
            id={id}
            role="dialog"
            aria-label="Paid status deletion actions"
            style={style}
            onTransitionEnd={(event) => {
                if (event.target === event.currentTarget && !isOpen) {
                    onHidden();
                }
            }}
            className={cn(
                "fixed z-50 rounded-xl border border-mist-gray/80 bg-white p-1.5 shadow-lg transition-all duration-150 ease-out",
                isOpen
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
            )}
        >
            <PromptActions isDeleting={isDeleting} onDelete={onDelete} />
        </div>,
        document.body
    );
}
