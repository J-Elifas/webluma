"use client";

import { useId } from "react";
import { AlertTriangle, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

type AlertTone = "danger" | "info";

interface AlertProps {
    isOpen: boolean;
    title: string;
    message: string;
    cancelLabel?: string;
    confirmLabel?: string;
    isConfirming?: boolean;
    tone?: AlertTone;
    onCancel: () => void;
    onConfirm: () => void;
}

const toneStyles = {
    danger: {
        Icon: AlertTriangle,
        icon: "bg-red-50 text-red-600",
        confirm:
            "bg-red-600 text-white shadow-[0_16px_30px_-18px_rgba(220,38,38,0.9)] hover:bg-red-700 focus-visible:outline-red-300 disabled:bg-red-300",
    },
    info: {
        Icon: Info,
        icon: "bg-luma-blue/10 text-luma-blue",
        confirm:
            "bg-luma-blue text-white shadow-[0_16px_30px_-18px_rgba(56,189,248,0.9)] hover:bg-[#1EA7E4] focus-visible:outline-luma-blue/40 disabled:bg-luma-blue/60",
    },
} satisfies Record<
    AlertTone,
    {
        Icon: typeof AlertTriangle;
        icon: string;
        confirm: string;
    }
>;

export default function Alert({
    cancelLabel = "No",
    confirmLabel = "Yes",
    isConfirming = false,
    isOpen,
    message,
    onCancel,
    onConfirm,
    title,
    tone = "danger",
}: AlertProps) {
    const messageId = useId();
    const { Icon, confirm, icon } = toneStyles[tone];

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            ariaDescribedBy={messageId}
            role="alertdialog"
            size="sm"
            showCloseButton={false}
            onClose={isConfirming ? () => undefined : onCancel}
        >
            <div className="space-y-5 transition-all duration-200 ease-out">
                <div className="flex items-start gap-3 transition-all duration-200 ease-out">
                    <span
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ease-out",
                            icon
                        )}
                    >
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <p
                        id={messageId}
                        className="min-w-0 text-sm font-medium leading-6 text-slate-gray"
                    >
                        {message}
                    </p>
                </div>

                <div className="flex flex-col-reverse gap-2 transition-all duration-200 ease-out sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        autoFocus
                        disabled={isConfirming}
                        onClick={onCancel}
                        className="rounded-xl px-4 transition-all duration-200"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={isConfirming}
                        onClick={onConfirm}
                        className={cn("rounded-xl px-4 transition-all duration-200", confirm)}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
