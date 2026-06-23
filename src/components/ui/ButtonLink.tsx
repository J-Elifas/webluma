import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

interface ButtonLinkProps {
    href: string;
    children: ReactNode;
    variant?: ButtonVariant;
    className?: string;
    ariaLabel?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    onNavigate?: ComponentProps<typeof Link>["onNavigate"];
}

export default function ButtonLink({
    href,
    children,
    variant = "primary",
    className = "",
    ariaLabel,
    onClick,
    onNavigate,
}: ButtonLinkProps) {
    const baseClasses =
        "inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200";

    const variantClasses =
        variant === "primary"
            ? "bg-luma-blue text-white hover:bg-[#1EA7E4]"
            : "border border-mist-gray bg-white text-midnight-slate hover:bg-cloud-white";

    return (
        <Link
            href={href}
            aria-label={ariaLabel}
            onClick={onClick}
            onNavigate={onNavigate}
            className={cn(baseClasses, variantClasses, className)}
        >
            {children}
        </Link>
    );
}
