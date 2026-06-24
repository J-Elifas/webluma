"use client";

import { useEffect, useEffectEvent } from "react";

export default function usePopoverViewportPosition(
    isOpen: boolean,
    updatePopoverPosition: () => void
) {
    const updatePopoverPositionEvent = useEffectEvent(updatePopoverPosition);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleViewportChange() {
            updatePopoverPositionEvent();
        }

        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("scroll", handleViewportChange, true);

        return () => {
            window.removeEventListener("resize", handleViewportChange);
            window.removeEventListener("scroll", handleViewportChange, true);
        };
    }, [isOpen]);
}
