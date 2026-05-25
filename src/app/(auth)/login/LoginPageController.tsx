"use client";

import { useState } from "react";
import LoginCard from "@/components/auth/LoginCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LoginFormController from "./LoginFormController";

export default function LoginPageController() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-10 pt-4 md:px-10">
            <LoginCard>
                <LoginFormController onPendingChange={setIsLoading} />
            </LoginCard>
            <LoadingSpinner isVisible={isLoading} label="Loading login operation" fullscreen />
        </main>
    );
}
