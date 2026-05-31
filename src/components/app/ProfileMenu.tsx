"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, MoreHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProfileMenuProps {
    name: string;
    email: string;
    onLogout: () => void | Promise<void>;
}

export default function ProfileMenu({ name, email, onLogout }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!(event.target instanceof Node)) {
                return;
            }

            if (!menuRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return;
            }

            setIsOpen(false);
            triggerRef.current?.focus({ preventScroll: true });
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleLogout = () => {
        setIsOpen(false);
        onLogout();
    };

    const menuVisibilityClasses = isOpen
        ? "pointer-events-auto translate-y-0 scale-100 opacity-100 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        : "pointer-events-none translate-y-2 scale-95 opacity-0 duration-0";

    return (
        <div
            ref={menuRef}
            className="relative rounded-2xl border border-mist-gray/70 bg-white p-3 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.5)]"
        >
            <button
                ref={triggerRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl text-left"
            >
                <div
                    className="h-11 w-11 shrink-0 rounded-full border border-dashed border-mist-gray bg-cloud-white"
                    aria-label="Profile picture placeholder"
                    role="img"
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-midnight-slate">{name}</p>
                    <p className="truncate text-xs font-medium text-slate-gray">{email}</p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-gray transition-colors group-hover:bg-cloud-white group-hover:text-midnight-slate">
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                </span>
            </button>

            <div
                role="menu"
                inert={!isOpen ? true : undefined}
                className={`absolute bottom-[calc(100%+0.75rem)] right-0 z-20 w-full origin-bottom-right rounded-2xl border border-mist-gray/70 bg-white p-2 shadow-[0_24px_54px_-26px_rgba(15,23,42,0.35)] transition-[opacity,transform] will-change-transform motion-reduce:transition-none ${menuVisibilityClasses}`}
            >
                <Button
                    variant="ghost"
                    size="sm"
                    isFullWidth
                    role="menuitem"
                    tabIndex={isOpen ? 0 : -1}
                    onClick={handleLogout}
                    className="h-auto justify-start rounded-xl px-3 py-2 text-left font-semibold focus:ring-offset-0"
                    leftIcon={<LogOut className="h-4 w-4 text-rose-500" />}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
