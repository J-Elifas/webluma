"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import AppSidebar from "@/components/app/AppSidebar";
import AppTopbar from "@/components/app/AppTopbar";
import MobileSidebarButton from "@/components/app/MobileSidebarButton";
import ProfileMenu from "@/components/app/ProfileMenu";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AppChromeControllerProps {
    children: ReactNode;
    user: {
        name: string;
        email: string;
    };
    workspaceLabel: string;
}

const pageTitles: Record<string, string> = {
    "/billing": "Billing",
    "/clients": "Clients",
    "/dashboard": "Dashboard",
};

export default function AppChromeController({
    children,
    user,
    workspaceLabel,
}: AppChromeControllerProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isInlineButtonVisible, setIsInlineButtonVisible] = useState(true);
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState("Loading page");
    const inlineButtonRef = useRef<HTMLButtonElement | null>(null);
    const floatingButtonRef = useRef<HTMLButtonElement | null>(null);
    const isInlineButtonVisibleRef = useRef(true);
    const pageTitle = pageTitles[pathname] ?? "Workspace";

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setIsRouteLoading(false);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [pathname]);

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

        const originalBodyOverflow = document.body.style.overflow;
        const originalDocumentOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleMobileClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalDocumentOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleMobileClose, isMobileOpen]);

    const handleMobileToggle = () => {
        setIsMobileOpen((currentValue) => {
            if (!currentValue) {
                const activeElement = document.activeElement;

                if (activeElement instanceof HTMLElement) {
                    activeElement.blur();
                }
            }

            return !currentValue;
        });
    };

    function handleRouteNavigate(href: string) {
        if (href !== pathname) {
            setLoadingLabel("Loading page");
            setIsRouteLoading(true);
        }
    }

    async function handleLogout() {
        setLoadingLabel("Logging out");
        setIsRouteLoading(true);

        try {
            await signOut({ callbackUrl: "/login" });
        } catch {
            setIsRouteLoading(false);
        }
    }

    const profileMenu = (
        <ProfileMenu
            name={user.name}
            email={user.email}
            onLogout={handleLogout}
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
                        currentPath={pathname}
                        isMobileOpen={isMobileOpen}
                        onNavigate={handleRouteNavigate}
                        onMobileClose={handleMobileClose}
                        profileMenu={profileMenu}
                    />
                }
                topbar={
                    <AppTopbar
                        pageTitle={pageTitle}
                        workspaceLabel={workspaceLabel}
                        mobileMenuButton={inlineMenuButton}
                    />
                }
            >
                {children}
            </AppShell>

            <MobileSidebarButton
                ref={floatingButtonRef}
                isExpanded={isMobileOpen}
                isVisible={!isInlineButtonVisible && !isMobileOpen}
                onClick={handleMobileToggle}
                variant="floating"
            />

            <LoadingSpinner isVisible={isRouteLoading} label={loadingLabel} fullscreen />
        </>
    );
}
