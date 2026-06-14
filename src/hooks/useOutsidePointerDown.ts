"use client";

import { useEffect, type RefObject } from "react";

type OutsidePointerRef = RefObject<Element | null>;

export default function useOutsidePointerDown(
    isEnabled: boolean,
    refs: OutsidePointerRef[],
    onOutsidePointerDown: () => void
) {
    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (refs.some((ref) => ref.current?.contains(target))) {
                return;
            }

            onOutsidePointerDown();
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isEnabled, onOutsidePointerDown, refs]);
}
