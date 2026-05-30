import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import FieldLabel from "./FieldLabel";
import { fieldControlClasses, fieldInputClasses } from "./field-styles";

interface PrefixedTextInputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    id: string;
    label: string;
    prefix: string;
    error?: string;
    inputClassName?: string;
    controlClassName?: string;
    labelClassName?: string;
    isRequired?: boolean;
}

export default function PrefixedTextInputField({
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    className,
    controlClassName,
    error,
    id,
    inputClassName,
    isRequired = false,
    label,
    labelClassName,
    prefix,
    required,
    ...props
}: PrefixedTextInputFieldProps) {
    const errorId = `${id}-error`;
    const prefixId = `${id}-prefix`;
    const describedBy = [prefixId, ariaDescribedBy, error ? errorId : undefined]
        .filter(Boolean)
        .join(" ");
    const isInvalid = Boolean(error || ariaInvalid);
    const isFieldRequired = isRequired || required;

    return (
        <div className={cn("space-y-2", className)}>
            <FieldLabel htmlFor={id} isRequired={isFieldRequired} className={labelClassName}>
                {label}
            </FieldLabel>
            <div
                className={cn(
                    "group flex items-stretch overflow-hidden p-0",
                    fieldControlClasses(isInvalid),
                    controlClassName
                )}
            >
                <span
                    id={prefixId}
                    aria-disabled="true"
                    className="flex shrink-0 select-none items-center border-r border-mist-gray bg-cloud-white px-3 text-sm font-black text-slate-gray transition-colors duration-200 ease-out group-focus-within:border-luma-blue/35"
                >
                    {prefix}
                </span>
                <input
                    id={id}
                    type="text"
                    required={isFieldRequired}
                    aria-invalid={error ? true : ariaInvalid}
                    aria-describedby={describedBy || undefined}
                    className={cn("px-3 py-2.5", fieldInputClasses, inputClassName)}
                    {...props}
                />
            </div>
            {error ? (
                <p id={errorId} className="text-sm font-medium text-red-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
