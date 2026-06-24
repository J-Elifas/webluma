"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

interface SessionExpiryControllerProps {
    sessionMaxAgeSeconds: number;
}

const LOGIN_PATH = "/login";

export default function SessionExpiryController({
    sessionMaxAgeSeconds,
}: SessionExpiryControllerProps) {
    useEffect(() => {
        const sessionMaxAgeMs = sessionMaxAgeSeconds * 1000;
        const logoutTimer = window.setTimeout(() => {
            void signOut({ callbackUrl: LOGIN_PATH });
        }, sessionMaxAgeMs);

        return () => {
            window.clearTimeout(logoutTimer);
        };
    }, [sessionMaxAgeSeconds]);

    return null;
}
