"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import AppShell from "@/components/app/AppShell";
import AppSidebar from "@/components/app/AppSidebar";
import AppTopbar from "@/components/app/AppTopbar";
import MobileSidebarButton from "@/components/app/MobileSidebarButton";
import ProfileMenu from "@/components/app/ProfileMenu";

interface AppChromeControllerProps {
    children: ReactNode;
    user: {
        name: string;
        email: string;
    };
    workspaceLabel: string;
}

export default function AppChromeController({
    children,
    user,
    workspaceLabel,
}: AppChromeControllerProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isInlineButtonVisible, setIsInlineButtonVisible] = useState(true);
    const inlineButtonRef = useRef<HTMLButtonElement | null>(null);
    const floatingButtonRef = useRef<HTMLButtonElement | null>(null);
    const isInlineButtonVisibleRef = useRef(true);

    useEffect(() => {
        let animationFrame: number | null = null;

        const updateInlineButtonVisibility = () => {
            const inlineButton = inlineButtonRef.current;

            if (!inlineButton) {
                return;
            }

            const bounds = inlineButton.getBoundingClientRect();
            const nextIsVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;

            if (isInlineButtonVisibleRef.current !== nextIsVisible) {
                isInlineButtonVisibleRef.current = nextIsVisible;
                setIsInlineButtonVisible(nextIsVisible);
            }
        };

        const scheduleInlineButtonVisibilityUpdate = () => {
            if (animationFrame !== null) {
                return;
            }

            animationFrame = window.requestAnimationFrame(() => {
                animationFrame = null;
                updateInlineButtonVisibility();
            });
        };

        updateInlineButtonVisibility();

        window.addEventListener("scroll", scheduleInlineButtonVisibilityUpdate, { passive: true });
        window.addEventListener("resize", scheduleInlineButtonVisibilityUpdate);

        return () => {
            window.removeEventListener("scroll", scheduleInlineButtonVisibilityUpdate);
            window.removeEventListener("resize", scheduleInlineButtonVisibilityUpdate);

            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    const handleMobileClose = useCallback(() => {
        const activeElement = document.activeElement;

        if (activeElement instanceof HTMLElement) {
            activeElement.blur();
        }

        setIsMobileOpen(false);

        window.requestAnimationFrame(() => {
            const menuButton = isInlineButtonVisibleRef.current
                ? inlineButtonRef.current
                : floatingButtonRef.current;

            menuButton?.focus({ preventScroll: true });
        });
    }, []);

    useEffect(() => {
        if (!isMobileOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleMobileClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleMobileClose, isMobileOpen]);

    const handleMobileToggle = () => {
        setIsMobileOpen((currentValue) => !currentValue);
    };

    const profileMenu = (
        <ProfileMenu
            name={user.name}
            email={user.email}
            onLogout={() => signOut({ callbackUrl: "/login" })}
        />
    );

    const inlineMenuButton = (
        <MobileSidebarButton
            ref={inlineButtonRef}
            isExpanded={isMobileOpen}
            onClick={handleMobileToggle}
            variant="inline"
        />
    );

    return (
        <>
            <AppShell
                sidebar={
                    <AppSidebar
                        isMobileOpen={isMobileOpen}
                        onMobileClose={handleMobileClose}
                        profileMenu={profileMenu}
                    />
                }
                topbar={
                    <AppTopbar
                        workspaceLabel={workspaceLabel}
                        mobileMenuButton={inlineMenuButton}
                    />
                }
            >
                {children}
            </AppShell>

            {!isInlineButtonVisible && !isMobileOpen ? (
                <MobileSidebarButton
                    ref={floatingButtonRef}
                    isExpanded={isMobileOpen}
                    onClick={handleMobileToggle}
                    variant="floating"
                />
            ) : null}
        </>
    );
}
