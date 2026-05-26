"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import AppSidebar from "@/components/app/AppSidebar";
import ProfileMenu from "@/components/app/ProfileMenu";

interface AppSidebarControllerProps {
    user: {
        name: string;
        email: string;
    };
}

export default function AppSidebarController({ user }: AppSidebarControllerProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <AppSidebar
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
            onMobileToggle={() => setIsMobileOpen((currentValue) => !currentValue)}
            profileMenu={
                <ProfileMenu
                    name={user.name}
                    email={user.email}
                    onLogout={() => signOut({ callbackUrl: "/login" })}
                />
            }
        />
    );
}
