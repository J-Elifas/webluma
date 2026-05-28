import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldLabelProps {
    children: ReactNode;
    htmlFor: string;
    isRequired?: boolean;
    className?: string;
}

export default function FieldLabel({
    children,
    className,
    htmlFor,
    isRequired = false,
}: FieldLabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn("block text-sm font-semibold text-midnight-slate", className)}
        >
            {children}
            {isRequired ? (
                <>
                    <span className="sr-only"> required</span>
                    <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                    </span>
                </>
            ) : null}
        </label>
    );
}
