import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/app/AppShell";
import AppTopbar from "@/components/app/AppTopbar";
import { authOptions } from "@/server/auth/options";
import AppSidebarController from "./AppSidebarController";

interface AppLayoutProps {
    children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const isGuest = session.user.role === "GUEST";
    const user = {
        name: session.user.name || (isGuest ? "Guest User" : "Demo User"),
        email: session.user.email || "demo@example.com",
    };

    return (
        <AppShell
            sidebar={<AppSidebarController user={user} />}
            topbar={<AppTopbar workspaceLabel={isGuest ? "Guest View" : "Demo Workspace"} />}
        >
            {children}
        </AppShell>
    );
}
