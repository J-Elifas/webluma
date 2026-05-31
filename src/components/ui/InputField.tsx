import type { InputHTMLAttributes, ReactNode } from "react";
import LockIcon from "@/components/svg/LockIcon";
import MailIcon from "@/components/svg/MailIcon";
import { cn } from "@/lib/utils";
import FieldLabel from "./FieldLabel";
import {
    fieldControlClasses,
    fieldDividerClasses,
    fieldIconClasses,
    fieldInputClasses,
} from "./field-styles";

type FieldType = NonNullable<InputHTMLAttributes<HTMLInputElement>["type"]>;

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    id: string;
    label: string;
    type?: FieldType;
    error?: string;
    icon?: ReactNode | null;
    inputClassName?: string;
    controlClassName?: string;
    labelClassName?: string;
    isRequired?: boolean;
}

function getDefaultIcon(type: FieldType) {
    if (type === "email") {
        return <MailIcon />;
    }

    if (type === "password") {
        return <LockIcon />;
    }

    return null;
}

export default function InputField({
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    id,
    label,
    type = "text",
    error,
    icon,
    inputClassName,
    controlClassName,
    labelClassName,
    isRequired = false,
    required,
    className = "",
    ...props
}: InputFieldProps) {
    const errorId = `${id}-error`;
    const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ");
    const renderedIcon = icon === undefined ? getDefaultIcon(type) : icon;
    const isInvalid = Boolean(error || ariaInvalid);
    const isFieldRequired = isRequired || required;

    return (
        <div className={cn("space-y-2", className)}>
            <FieldLabel htmlFor={id} isRequired={isFieldRequired} className={labelClassName}>
                {label}
            </FieldLabel>
            <div
                className={cn(
                    "group flex items-center gap-2 px-3 py-2.5",
                    fieldControlClasses(isInvalid),
                    controlClassName
                )}
            >
                {renderedIcon ? (
                    <>
                        <span className={fieldIconClasses}>{renderedIcon}</span>
                        <div className={fieldDividerClasses} aria-hidden="true" />
                    </>
                ) : null}
                <input
                    id={id}
                    type={type}
                    required={isFieldRequired}
                    aria-invalid={error ? true : ariaInvalid}
                    aria-describedby={describedBy || undefined}
                    className={cn(fieldInputClasses, inputClassName)}
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
