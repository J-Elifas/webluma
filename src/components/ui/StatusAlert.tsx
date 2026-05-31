"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusAlertTone = "success" | "error";

interface StatusAlertProps {
    tone: StatusAlertTone;
    title: string;
    message: string;
    onDismiss?: () => void;
    className?: string;
}

const toneStyles = {
    success: {
        Icon: CheckCircle2,
        container: "border-soft-mint/80",
        icon: "bg-soft-mint/45 text-teal-700",
    },
    error: {
        Icon: AlertCircle,
        container: "border-red-200",
        icon: "bg-red-50 text-red-600",
    },
} satisfies Record<
    StatusAlertTone,
    {
        Icon: typeof CheckCircle2;
        container: string;
        icon: string;
    }
>;

export default function StatusAlert({
    className,
    message,
    onDismiss,
    title,
    tone,
}: StatusAlertProps) {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const { Icon, container, icon } = toneStyles[tone];

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setPortalRoot(document.body);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, []);

    const alert = (
        <aside
            role={tone === "error" ? "alert" : "status"}
            aria-live={tone === "error" ? "assertive" : "polite"}
            className={cn(
                "fixed top-4 right-4 left-4 z-[100] flex items-start gap-3 rounded-xl border bg-white p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.75)] sm:top-6 sm:right-6 sm:left-auto sm:w-full sm:max-w-sm",
                container,
                className
            )}
        >
            <span
                className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", icon)}
            >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-midnight-slate">{title}</span>
                <span className="mt-1 block text-sm font-medium leading-5 text-slate-gray">
                    {message}
                </span>
            </span>
            {onDismiss ? (
                <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-gray transition-colors hover:bg-cloud-white hover:text-midnight-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luma-blue"
                    aria-label="Dismiss notification"
                    onClick={onDismiss}
                >
                    <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>
            ) : null}
        </aside>
    );

    if (!portalRoot) {
        return null;
    }

    return createPortal(alert, portalRoot);
}
