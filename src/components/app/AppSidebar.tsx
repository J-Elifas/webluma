"use client";

import type { ReactNode, TouchEvent } from "react";
import { useRef } from "react";
import {
    CreditCard,
    FileText,
    LayoutDashboard,
    LineChart,
    Settings,
    Users,
    WalletCards,
    X,
    Zap,
    type LucideIcon,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

interface SidebarItem {
    label: string;
    icon: LucideIcon;
    active?: boolean;
}

const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Clients", icon: Users },
    { label: "Invoices", icon: FileText },
    { label: "Subscriptions", icon: CreditCard },
    { label: "Billing", icon: WalletCards },
    { label: "Reports", icon: LineChart },
    { label: "Settings", icon: Settings },
];

interface AppSidebarProps {
    isMobileOpen: boolean;
    profileMenu: ReactNode;
    onMobileClose: () => void;
}

interface SidebarPanelProps {
    onMobileClose: () => void;
    profileMenu: ReactNode;
}

function SidebarPanel({ onMobileClose, profileMenu }: SidebarPanelProps) {
    return (
        <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-mist-gray/70 bg-white/95 p-4 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.55)] backdrop-blur lg:bg-white/88">
            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex min-h-full flex-col">
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            aria-label="Close sidebar"
                            onClick={onMobileClose}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-mist-gray/70 bg-white text-midnight-slate shadow-sm transition-colors hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue lg:hidden"
                        >
                            <X className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3">
                        <Logo width={142} height={38} className="h-10 w-auto" />
                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-luma-blue/20 bg-luma-blue/10 px-2.5 py-1 text-xs font-bold text-luma-blue">
                                ClientFlow
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-mist-gray/70 bg-cloud-white/80 px-3 py-2.5">
                        <p className="text-xs font-semibold uppercase text-slate-gray">Workspace</p>
                        <p className="mt-1 truncate text-sm font-bold text-midnight-slate">
                            Freelance Growth
                        </p>
                    </div>

                    <nav className="mt-6 space-y-1.5" aria-label="Dashboard navigation">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    aria-current={item.active ? "page" : undefined}
                                    aria-disabled={!item.active}
                                    disabled={!item.active}
                                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-bold transition-colors ${item.active
                                        ? "bg-midnight-slate text-white shadow-[0_16px_32px_-24px_rgba(15,23,42,0.85)]"
                                        : "text-slate-gray disabled:cursor-not-allowed disabled:opacity-75"
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon
                                            className={`h-4 w-4 ${item.active ? "text-luma-blue" : "text-slate-gray"
                                                }`}
                                            aria-hidden="true"
                                        />
                                        {item.label}
                                    </span>
                                    {!item.active ? (
                                        <span className="rounded-full bg-cloud-white px-2 py-0.5 text-[10px] font-bold uppercase text-slate-gray">
                                            Soon
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-6">
                        <div className="rounded-2xl border border-luma-blue/20 bg-luma-blue/10 p-4">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-luma-blue shadow-sm">
                                    <Zap className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-midnight-slate">
                                        Cashflow pulse
                                    </p>
                                    <p className="text-xs font-medium text-slate-gray">
                                        June revenue is 91% collected.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3">{profileMenu}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function AppSidebar({ isMobileOpen, profileMenu, onMobileClose }: AppSidebarProps) {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.changedTouches[0];

        if (!touch) {
            return;
        }

        touchStartRef.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const startPosition = touchStartRef.current;
        const touch = event.changedTouches[0];

        touchStartRef.current = null;

        if (!startPosition || !touch) {
            return;
        }

        const horizontalDistance = touch.clientX - startPosition.x;
        const verticalDistance = Math.abs(touch.clientY - startPosition.y);

        if (horizontalDistance > 70 && verticalDistance < 80) {
            onMobileClose();
        }
    };

    return (
        <>
            <div
                aria-hidden={!isMobileOpen}
                inert={!isMobileOpen ? true : undefined}
                className={`fixed inset-0 z-[60] lg:hidden ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
            >
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onMobileClose}
                    onMouseDown={(event) => event.preventDefault()}
                    tabIndex={isMobileOpen ? 0 : -1}
                    className={`absolute inset-0 bg-midnight-slate/35 transition-opacity duration-300 ease-out ${isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                />
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className={`absolute right-0 top-0 flex h-full w-[min(21rem,calc(100vw-1.5rem))] flex-col p-3 transition-transform duration-300 ease-out will-change-transform ${isMobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
                        }`}
                >
                    <div className="min-h-0 flex-1">
                        <SidebarPanel onMobileClose={onMobileClose} profileMenu={profileMenu} />
                    </div>
                </div>
            </div>

            <div className="hidden lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0">
                <SidebarPanel onMobileClose={onMobileClose} profileMenu={profileMenu} />
            </div>
        </>
    );
}
