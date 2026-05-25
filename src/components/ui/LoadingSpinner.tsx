interface LoadingSpinnerProps {
    isVisible: boolean;
    label?: string;
    className?: string;
}

export default function LoadingSpinner({
    isVisible,
    label = "Loading",
    className = "",
}: LoadingSpinnerProps) {
    return (
        <div
            role="status"
            aria-busy={isVisible}
            aria-hidden={!isVisible}
            className={`absolute inset-0 z-30 flex items-center justify-center bg-cloud-white/85 backdrop-blur-sm transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            } ${className}`.trim()}
        >
            <span className="loader" aria-hidden="true" />
            <span className="sr-only">{label}</span>
        </div>
    );
}
