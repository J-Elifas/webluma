"use client";

import { useEffect, useEffectEvent, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    size?: ModalSize;
    onClose: () => void;
    onAfterClose?: () => void;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
};

const modalExitTransitionMs = 150;
const focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getExitDelay() {
    if (typeof window.matchMedia !== "function") {
        return modalExitTransitionMs;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : modalExitTransitionMs;
}

export default function Modal({
    children,
    description,
    isOpen,
    onAfterClose,
    onClose,
    size = "md",
    title,
}: ModalProps) {
    const titleId = useId();
    const descriptionId = useId();
    const dialogRef = useRef<HTMLElement | null>(null);
    const [isPresent, setIsPresent] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    const handleAfterClose = useEffectEvent(() => {
        onAfterClose?.();
    });

    const handleDocumentKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (!isOpen) {
            return;
        }

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
            dialog.querySelectorAll<HTMLElement>(focusableSelector)
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
    });

    useEffect(() => {
        if (isOpen) {
            if (!isPresent) {
                const frameId = window.requestAnimationFrame(() => {
                    setIsPresent(true);
                });

                return () => {
                    window.cancelAnimationFrame(frameId);
                };
            }

            const frameId = window.requestAnimationFrame(() => {
                setIsVisible(true);
            });

            return () => {
                window.cancelAnimationFrame(frameId);
            };
        }

        if (!isPresent) {
            return;
        }

        let timeoutId: number | undefined;
        const frameId = window.requestAnimationFrame(() => {
            setIsVisible(false);
            timeoutId = window.setTimeout(() => {
                setIsPresent(false);
                handleAfterClose();
            }, getExitDelay());
        });

        return () => {
            window.cancelAnimationFrame(frameId);

            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [isOpen, isPresent]);

    useEffect(() => {
        if (!isPresent) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleDocumentKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleDocumentKeyDown);
        };
    }, [isPresent]);

    if (!isPresent) {
        return null;
    }

    return createPortal(
        <div
            data-modal-viewport="true"
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-3 sm:items-center sm:px-6 sm:py-6"
        >
            <div
                className={cn(
                    "absolute inset-0 bg-midnight-slate/45 backdrop-blur-sm transition-opacity motion-reduce:transition-none",
                    isVisible
                        ? "opacity-100 duration-200 ease-out"
                        : "opacity-0 duration-150 ease-in"
                )}
                aria-hidden="true"
                onMouseDown={isOpen ? onClose : undefined}
            />
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                inert={!isOpen ? true : undefined}
                className={cn(
                    "relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-[1.25rem] border border-mist-gray/80 bg-white shadow-[0_30px_80px_-34px_rgba(15,23,42,0.65)] transition-[opacity,translate,scale] will-change-[opacity,translate,scale] motion-reduce:transition-none sm:max-h-[min(44rem,calc(100dvh-3rem))]",
                    sizeClasses[size],
                    !isOpen && "pointer-events-none",
                    isVisible
                        ? "translate-y-0 scale-100 opacity-100 duration-200 ease-out"
                        : "translate-y-3 scale-[0.98] opacity-0 duration-150 ease-in"
                )}
            >
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-mist-gray/70 px-5 py-4 shadow-[0_-10px_20px_-0px_rgba(15,23,42,0.5)]">
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
                <div
                    data-modal-scroll-container="true"
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
                >
                    {children}
                </div>
            </section>
        </div>,
        document.body
    );
}
