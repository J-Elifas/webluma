import type { SvgIconProps } from "./types";

export default function FacebookIcon({ className = "h-5 w-5", title, ...props }: SvgIconProps) {
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
            <circle cx="12" cy="12" r="10" fill="#1877F2" />
            <path
                fill="#FFFFFF"
                d="M14.8 12.6h-2v6h-2.5v-6H8.9v-2.2h1.4V9c0-1.8 1.1-2.9 3-2.9.8 0 1.6.1 1.6.1v1.9H14c-.9 0-1.2.5-1.2 1.1v1.2h2l-.3 2.2Z"
            />
        </svg>
    );
}
