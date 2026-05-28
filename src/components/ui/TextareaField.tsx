import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import FieldLabel from "./FieldLabel";
import { fieldControlClasses } from "./field-styles";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    error?: string;
    isRequired?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
}

export default function TextareaField({
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    className,
    error,
    id,
    isRequired = false,
    label,
    labelClassName,
    required,
    wrapperClassName,
    ...props
}: TextareaFieldProps) {
    const errorId = `${id}-error`;
    const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ");
    const isInvalid = Boolean(error || ariaInvalid);
    const isFieldRequired = isRequired || required;

    return (
        <div className={cn("space-y-2", wrapperClassName)}>
            <FieldLabel htmlFor={id} isRequired={isFieldRequired} className={labelClassName}>
                {label}
            </FieldLabel>
            <textarea
                id={id}
                required={isFieldRequired}
                aria-invalid={error ? true : ariaInvalid}
                aria-describedby={describedBy || undefined}
                className={cn(
                    fieldControlClasses(isInvalid),
                    "min-h-28 resize-y px-3 py-2.5 leading-6 placeholder:text-slate-gray/75",
                    className
                )}
                {...props}
            />
            {error ? (
                <p id={errorId} className="text-sm font-medium text-red-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
