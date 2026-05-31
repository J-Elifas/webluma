import type { SvgIconProps } from "./types";

export default function LockIcon({ className = "h-5 w-5", title, ...props }: SvgIconProps) {
    const hasAccessibleName = Boolean(title || props["aria-label"] || props["aria-labelledby"]);

    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            role={hasAccessibleName ? "img" : undefined}
            aria-hidden={hasAccessibleName ? undefined : true}
            {...props}
        >
            {title ? <title>{title}</title> : null}
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
