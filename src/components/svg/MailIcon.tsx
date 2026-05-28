import type { SvgIconProps } from "./types";

export default function MailIcon({ className = "h-5 w-5", title, ...props }: SvgIconProps) {
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
