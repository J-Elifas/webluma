"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingSpinnerProps {
    isVisible: boolean;
    label?: string;
    fullscreen?: boolean;
    className?: string;
}

let activeScrollLocks = 0;
let previousBodyOverflow = "";
let previousDocumentOverflow = "";

function lockPageScroll() {
    if (activeScrollLocks === 0) {
        previousBodyOverflow = document.body.style.overflow;
        previousDocumentOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
    }

    activeScrollLocks += 1;
}

function unlockPageScroll() {
    activeScrollLocks = Math.max(activeScrollLocks - 1, 0);

    if (activeScrollLocks === 0) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousDocumentOverflow;
    }
}

export default function LoadingSpinner({
    isVisible,
    label = "Loading",
    fullscreen = false,
    className = "",
}: LoadingSpinnerProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const positionClasses = fullscreen ? "fixed inset-0 z-[90]" : "absolute inset-0 z-30";

    useEffect(() => {
        if (!fullscreen) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setPortalRoot(document.body);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [fullscreen]);

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        lockPageScroll();

        return () => {
            unlockPageScroll();
        };
    }, [isVisible]);

    const spinner = (
        <div
            role="status"
            aria-busy={isVisible}
            aria-hidden={!isVisible}
            className={`${positionClasses} flex items-center justify-center bg-cloud-white/85 backdrop-blur-sm transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            } ${className}`.trim()}
        >
            <span className="loader" aria-hidden="true" />
            <span className="sr-only">{label}</span>
        </div>
    );

    if (fullscreen && portalRoot) {
        return createPortal(spinner, portalRoot);
    }

    return spinner;
}
