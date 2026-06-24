"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { MoreVertical } from "lucide-react";
import Button from "@/components/ui/Button";
import useOutsidePointerDown from "@/hooks/useOutsidePointerDown";
import { cn } from "@/lib/utils";
import PaidInvoiceDeletePrompt from "./PaidInvoiceDeletePrompt";

interface PaidInvoiceActionsProps {
    invoiceNumber: string;
    onDelete: () => Promise<boolean>;
}

export default function PaidInvoiceActions({ invoiceNumber, onDelete }: PaidInvoiceActionsProps) {
    const popoverId = useId();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const promptRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverRendered, setIsPopoverRendered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [promptStyle, setPromptStyle] = useState<CSSProperties>({});

    function openPopover() {
        const triggerRect = triggerRef.current?.getBoundingClientRect();

        if (triggerRect) {
            setPromptStyle({
                top: triggerRect.bottom + 6,
                right: window.innerWidth - triggerRect.right,
            });
        }

        setIsPopoverRendered(true);
        window.requestAnimationFrame(() => setIsOpen(true));
    }

    function closePopover() {
        if (isDeleting) {
            return;
        }

        setIsOpen(false);
    }

    useOutsidePointerDown(isOpen && !isDeleting, [wrapperRef, promptRef], closePopover);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Escape" || isDeleting) {
                return;
            }

            setIsOpen(false);
            triggerRef.current?.focus({ preventScroll: true });
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDeleting, isOpen]);

    async function handleDeletePayment() {
        if (isDeleting) {
            return;
        }

        setIsDeleting(true);

        const wasDeleted = await onDelete();

        setIsDeleting(false);

        if (wasDeleted) {
            setIsOpen(false);
        }
    }

    return (
        <div ref={wrapperRef} className="relative">
            <Button
                ref={triggerRef}
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`More payment actions for ${invoiceNumber}`}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-controls={isPopoverRendered ? popoverId : undefined}
                disabled={isDeleting}
                onClick={() => {
                    if (isOpen) {
                        closePopover();
                        return;
                    }

                    openPopover();
                }}
                className={cn(
                    "h-9 w-9 rounded-xl border border-transparent text-slate-gray hover:border-mist-gray/70 hover:bg-cloud-white hover:text-midnight-slate focus:ring-2 focus:ring-luma-blue/30",
                    isOpen && "border-luma-blue/60 bg-luma-blue/10 text-luma-blue"
                )}
            >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>

            <PaidInvoiceDeletePrompt
                id={popoverId}
                isDeleting={isDeleting}
                isOpen={isOpen}
                isRendered={isPopoverRendered}
                promptRef={promptRef}
                style={promptStyle}
                onDelete={handleDeletePayment}
                onHidden={() => setIsPopoverRendered(false)}
            />
        </div>
    );
}
