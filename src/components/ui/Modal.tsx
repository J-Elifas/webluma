"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ModalSize = "md" | "lg";

interface ModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    size?: ModalSize;
    onClose: () => void;
}

const sizeClasses: Record<ModalSize, string> = {
    md: "max-w-lg",
    lg: "max-w-2xl",
};

const closeAnimationMs = 180;

export default function Modal({
    children,
    description,
    isOpen,
    onClose,
    size = "md",
    title,
}: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef<HTMLElement | null>(null);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timeoutId = window.setTimeout(() => {
                setShouldRender(true);
            }, 0);

            return () => {
                window.clearTimeout(timeoutId);
            };
        }

        if (!shouldRender) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShouldRender(false);
        }, closeAnimationMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isOpen, shouldRender]);

    useEffect(() => {
        if (!shouldRender) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [shouldRender]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key !== "Tab") {
                return;
            }

            const dialog = dialogRef.current;

            if (!dialog) {
                return;
            }

            const focusableElements = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!shouldRender) {
        return null;
    }

    return createPortal(
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6",
                isOpen ? "pointer-events-auto" : "pointer-events-none"
            )}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-midnight-slate/45 backdrop-blur-sm fill-mode-both motion-reduce:animate-none",
                    isOpen
                        ? "animate-in fade-in duration-200 ease-out"
                        : "animate-out fade-out duration-150 ease-in"
                )}
                aria-hidden="true"
                onMouseDown={onClose}
            />
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className={cn(
                    "relative z-10 flex max-h-[min(44rem,calc(100vh-2rem))] w-full flex-col overflow-hidden rounded-[1.25rem] border border-mist-gray/80 bg-white shadow-[0_30px_80px_-34px_rgba(15,23,42,0.65)] fill-mode-both will-change-transform motion-reduce:animate-none",
                    sizeClasses[size],
                    isOpen
                        ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 ease-out"
                        : "animate-out fade-out zoom-out-95 slide-out-to-bottom-2 duration-150 ease-in"
                )}
            >
                <header className="flex items-start justify-between gap-4 border-b border-mist-gray/70 px-5 py-4 shadow-[0_-10px_20px_-0px_rgba(15,23,42,0.5)]">
                    <div className="min-w-0 mb-3">
                        <h2 id={titleId} className="text-lg font-black text-midnight-slate">
                            {title}
                        </h2>
                        {description ? (
                            <p
                                id={descriptionId}
                                className="mt-1 text-sm font-medium leading-6 text-slate-gray"
                            >
                                {description}
                            </p>
                        ) : null}
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon-md"
                        aria-label="Close modal"
                        autoFocus
                        onClick={onClose}
                        className="text-slate-gray hover:text-midnight-slate"
                    >
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </header>
                <div className="overflow-y-auto px-5 py-5">{children}</div>
            </section>
        </div>,
        document.body
    );
}
