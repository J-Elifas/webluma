import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isFullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-luma-blue text-white shadow-[0_16px_30px_-18px_rgba(56,189,248,0.9)] hover:bg-[#1EA7E4] disabled:bg-luma-blue/60",
    dark: "bg-midnight-slate text-white shadow-[0_16px_32px_-24px_rgba(15,23,42,0.85)] hover:bg-slate-800 disabled:bg-slate-gray/30 disabled:text-slate-gray",
    secondary:
        "border border-mist-gray/70 bg-white text-midnight-slate shadow-sm hover:bg-cloud-white disabled:opacity-60",
    ghost: "text-midnight-slate hover:bg-cloud-white disabled:text-slate-gray disabled:opacity-60",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-10 rounded-2xl px-3.5 text-sm",
    md: "rounded-2xl px-4 py-3 text-sm",
    lg: "rounded-xl px-5 py-3 text-sm",
    "icon-sm": "h-9 w-9 rounded-xl p-0",
    "icon-md": "h-10 w-10 rounded-xl p-0",
    "icon-lg": "h-11 w-11 rounded-2xl p-0",
};

export default function Button({
    children,
    className,
    isFullWidth = false,
    leftIcon,
    rightIcon,
    size = "md",
    type = "button",
    variant = "primary",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:shadow-none",
                variantClasses[variant],
                sizeClasses[size],
                isFullWidth && "w-full",
                className
            )}
            {...props}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
}
