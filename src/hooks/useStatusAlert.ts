"use client";

import { useEffect, useState } from "react";
import type { StatusAlertTone } from "@/components/ui/StatusAlert";

interface AppStatusAlert {
    id: number;
    tone: StatusAlertTone;
    title: string;
    message: string;
}

type AppStatusAlertInput = Omit<AppStatusAlert, "id">;

export default function useStatusAlert(timeoutMs = 6000) {
    const [alert, setAlert] = useState<AppStatusAlert | null>(null);

    useEffect(() => {
        if (!alert) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setAlert(null);
        }, timeoutMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [alert, timeoutMs]);

    function showStatusAlert(nextAlert: AppStatusAlertInput) {
        setAlert({
            ...nextAlert,
            id: Date.now(),
        });
    }

    return {
        alert,
        setAlert,
        showStatusAlert,
    };
}
