"use client";

import { useState } from "react";

export default function usePendingState(onPendingChange?: (isPending: boolean) => void) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setPendingState(isPending: boolean) {
        setIsSubmitting(isPending);
        onPendingChange?.(isPending);
    }

    return {
        isSubmitting,
        setPendingState,
    };
}
