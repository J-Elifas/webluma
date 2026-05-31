import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth/options";
import AppChromeController from "./AppChromeController";
import SessionExpiryController from "./SessionExpiryController";

interface AppLayoutProps {
    children: ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const sessionMaxAgeSeconds = authOptions.session?.maxAge ?? 60 * 60;
    const isGuest = session.user.role === "GUEST";
    const user = {
        name: session.user.name || "Guest User",
        email: session.user.email || "guest@guest.com",
    };

    return (
        <>
            <SessionExpiryController sessionMaxAgeSeconds={sessionMaxAgeSeconds} />
            <AppChromeController
                user={user}
                workspaceLabel={isGuest ? "Guest View" : "Demo Workspace"}
            >
                {children}
            </AppChromeController>
        </>
    );
}
