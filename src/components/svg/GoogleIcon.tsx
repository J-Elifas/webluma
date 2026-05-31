import type { SvgIconProps } from "./types";

export default function GoogleIcon({ className = "h-5 w-5", title, ...props }: SvgIconProps) {
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
                fill="#4285F4"
                d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.4h3.2c1.9-1.7 3-4.2 3-7.1Z"
            />
            <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.6-2.6l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.5A10 10 0 0 0 12 22Z"
            />
            <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.7H3.1a10 10 0 0 0 0 8.9l3.3-2.8Z" />
            <path
                fill="#EA4335"
                d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 12 2a10 10 0 0 0-8.9 5.7l3.3 2.5C7.2 7.9 9.4 6.1 12 6.1Z"
            />
        </svg>
    );
}
