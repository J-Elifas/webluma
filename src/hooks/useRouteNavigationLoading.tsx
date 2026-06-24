"use client";

import { createContext, useContext, type ReactNode } from "react";

type RouteNavigationLoadingHandler = (href: string) => void;

const RouteNavigationLoadingContext = createContext<RouteNavigationLoadingHandler | null>(null);

interface RouteNavigationLoadingProviderProps {
    children: ReactNode;
    onNavigate: RouteNavigationLoadingHandler;
}

export function RouteNavigationLoadingProvider({
    children,
    onNavigate,
}: RouteNavigationLoadingProviderProps) {
    return (
        <RouteNavigationLoadingContext.Provider value={onNavigate}>
            {children}
        </RouteNavigationLoadingContext.Provider>
    );
}

export default function useRouteNavigationLoading() {
    const onNavigate = useContext(RouteNavigationLoadingContext);

    if (!onNavigate) {
        throw new Error(
            "useRouteNavigationLoading must be used within RouteNavigationLoadingProvider",
        );
    }

    return onNavigate;
}
