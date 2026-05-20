import type { InputHTMLAttributes } from "react";

type FieldType = "email" | "password" | "text";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    id: string;
    label: string;
    type?: FieldType;
    error?: string;
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path d="m4.5 7.5 7.5 5.6 7.5-5.6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

export default function InputField({
    id,
    label,
    type = "text",
    error,
    className = "",
    "aria-describedby": ariaDescribedBy,
    ...props
}: InputFieldProps) {
    const errorId = `${id}-error`;
    const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ");

    return (
        <div className={`space-y-2 ${className}`.trim()}>
            <label htmlFor={id} className="block text-sm font-semibold text-midnight-slate">
                {label}
            </label>
            <div
                className={`flex items-center rounded-xl border bg-white px-3 py-2.5 shadow-[0_1px_0_rgba(15,23,42,0.02)] focus-within:ring-2 ${
                    error
                        ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
                        : "border-mist-gray focus-within:border-luma-blue focus-within:ring-luma-blue/20"
                }`}
            >
                <span className="mr-2 text-slate-gray" aria-hidden="true">
                    {type === "email" ? <MailIcon /> : <LockIcon />}
                </span>
                <div className="mr-2 h-5 w-px bg-mist-gray" aria-hidden="true" />
                <input
                    id={id}
                    type={type}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy || undefined}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-midnight-slate outline-none placeholder:text-slate-gray/75"
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
