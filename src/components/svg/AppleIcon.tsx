import type { SvgIconProps } from "./types";

export default function AppleIcon({ className = "h-5 w-5", title, ...props }: SvgIconProps) {
    const hasAccessibleName = Boolean(title || props["aria-label"] || props["aria-labelledby"]);

    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            role={hasAccessibleName ? "img" : undefined}
            aria-hidden={hasAccessibleName ? undefined : true}
            {...props}
        >
            {title ? <title>{title}</title> : null}
            <path
                fill="currentColor"
                d="M16.5 13c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.2-2.6-.1-.1-2.6-1-2.6-3.5ZM14.3 6.2c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.9-1 2.9 1 .1 2-.5 2.7-1.3Z"
            />
        </svg>
    );
}
