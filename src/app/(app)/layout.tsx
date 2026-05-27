import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth/options";
import AppChromeController from "./AppChromeController";

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
        <AppChromeController user={user} workspaceLabel={isGuest ? "Guest View" : "Demo Workspace"}>
            {children}
        </AppChromeController>
    );
}
