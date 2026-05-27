"use client";

import { forwardRef } from "react";
import { Menu } from "lucide-react";

interface MobileSidebarButtonProps {
    isExpanded: boolean;
    onClick: () => void;
    variant?: "inline" | "floating";
}

const variantClasses = {
    inline: "h-10 w-10 rounded-xl border-mist-gray/70 bg-white text-midnight-slate shadow-sm",
    floating:
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 h-12 w-12 rounded-2xl border-luma-blue/25 bg-midnight-slate text-white shadow-[0_18px_44px_-18px_rgba(15,23,42,0.75)]",
};

const MobileSidebarButton = forwardRef<HTMLButtonElement, MobileSidebarButtonProps>(
    function MobileSidebarButton({ isExpanded, onClick, variant = "inline" }, ref) {
        return (
            <button
                ref={ref}
                type="button"
                aria-label={isExpanded ? "Close sidebar" : "Open sidebar"}
                aria-expanded={isExpanded}
                onClick={onClick}
                className={`inline-flex cursor-pointer items-center justify-center border transition-colors hover:bg-cloud-white hover:text-midnight-slate focus:outline-none focus:ring-2 focus:ring-luma-blue lg:hidden ${variantClasses[variant]}`}
            >
                <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </button>
        );
    }
);

export default MobileSidebarButton;
