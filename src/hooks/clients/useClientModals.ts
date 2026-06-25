"use client";

import { useState } from "react";

export default function useClientModals() {
    const [isAddClientOpen, setIsAddClientOpen] = useState(false);

    function handleAddClientSelect() {
        setIsAddClientOpen(true);
    }

    function handleAddClientClose() {
        setIsAddClientOpen(false);
    }

    return {
        isAddClientOpen,
        handleAddClientClose,
        handleAddClientSelect,
    };
}
