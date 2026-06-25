"use client";

import { ChevronDown, Filter } from "lucide-react";
import {
    useEffect,
    useId,
    useRef,
    useState,
    type FormEvent,
    type FormEventHandler,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import useOutsidePointerDown from "@/hooks/useOutsidePointerDown";
import usePopoverViewportPosition from "@/hooks/usePopoverViewportPosition";
import { cn } from "@/lib/utils";

interface TableFilterPopoverProps {
    appliedFilterCount: number;
    ariaLabel: string;
    children: ReactNode;
    dialogLabel: string;
    onApply: FormEventHandler<HTMLFormElement>;
    onOpen?: () => void;
    onReset: () => void;
}

export default function TableFilterPopover({
    appliedFilterCount,
    ariaLabel,
    children,
    dialogLabel,
    onApply,
    onOpen,
    onReset,
}: TableFilterPopoverProps) {
    const popoverId = useId();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverRendered, setIsPopoverRendered] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({
        left: 0,
        maxHeight: 360,
        top: 0,
        width: 560,
    });
    const filterButtonLabel =
        appliedFilterCount > 0
            ? `${ariaLabel}, ${appliedFilterCount} ${
                  appliedFilterCount === 1 ? "filter" : "filters"
              } applied`
            : ariaLabel;

    function updatePopoverPosition() {
        const trigger = triggerRef.current;

        if (!trigger) {
            return;
        }

        const viewportPadding = 16;
        const triggerRect = trigger.getBoundingClientRect();
        const width = Math.min(560, window.innerWidth - viewportPadding * 2);
        const preferredLeft =
            window.innerWidth >= 640 ? triggerRect.right - width : triggerRect.left;
        const left = Math.min(
            Math.max(viewportPadding, preferredLeft),
            window.innerWidth - width - viewportPadding
        );
        const top = triggerRect.bottom + 8;
        const maxHeight = Math.max(220, window.innerHeight - top - viewportPadding);

        setPopoverPosition({
            left,
            maxHeight,
            top,
            width,
        });
    }

    useOutsidePointerDown(isOpen, [wrapperRef, popoverRef], () => setIsOpen(false));

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    usePopoverViewportPosition(isOpen, updatePopoverPosition);

    function openPopover() {
        onOpen?.();
        updatePopoverPosition();
        setIsPopoverRendered(true);
        window.requestAnimationFrame(() => setIsOpen(true));
    }

    function handleApply(event: FormEvent<HTMLFormElement>) {
        onApply(event);
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative flex-1 sm:flex-none">
            <Button
                ref={triggerRef}
                variant="secondary"
                size="sm"
                aria-label={filterButtonLabel}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                aria-controls={popoverId}
                onClick={() => {
                    if (isOpen) {
                        setIsOpen(false);
                        return;
                    }

                    openPopover();
                }}
                className={cn(
                    "w-full min-w-[8.5rem] rounded-xl px-3 font-semibold transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:ring-2 focus:ring-luma-blue/25 sm:w-auto",
                    isOpen && "border-luma-blue ring-2 ring-luma-blue/25"
                )}
                leftIcon={<Filter className="h-4 w-4 text-slate-gray" aria-hidden="true" />}
                rightIcon={
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-slate-gray transition-transform duration-150",
                            isOpen && "rotate-180 text-luma-blue"
                        )}
                        aria-hidden="true"
                    />
                }
            >
                <span>Filter</span>
                {appliedFilterCount > 0 ? (
                    <span
                        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-luma-blue px-1.5 text-xs font-black text-white"
                        aria-hidden="true"
                    >
                        {appliedFilterCount}
                    </span>
                ) : null}
            </Button>

            {isPopoverRendered
                ? createPortal(
                      <div
                          ref={popoverRef}
                          id={popoverId}
                          role="dialog"
                          aria-label={dialogLabel}
                          style={{
                              left: popoverPosition.left,
                              maxHeight: popoverPosition.maxHeight,
                              top: popoverPosition.top,
                              width: popoverPosition.width,
                          }}
                          onTransitionEnd={(event) => {
                              if (event.target === event.currentTarget && !isOpen) {
                                  setIsPopoverRendered(false);
                              }
                          }}
                          className={cn(
                              "fixed z-50 origin-top overflow-visible rounded-[1.25rem] border border-mist-gray/80 bg-white p-4 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.65)] transition-all duration-150 ease-out",
                              isOpen
                                  ? "translate-y-0 scale-100 opacity-100"
                                  : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                          )}
                      >
                          <div className="flex items-center justify-between gap-3 border-b border-mist-gray/70 pb-3">
                              <p className="text-sm font-black text-midnight-slate">Filter</p>
                              <button
                                  type="button"
                                  onClick={onReset}
                                  className="rounded-lg px-2 py-1 text-xs font-bold text-luma-blue transition-colors hover:bg-luma-blue/10 focus:outline-none focus:ring-2 focus:ring-luma-blue/25"
                              >
                                  Reset
                              </button>
                          </div>

                          <form onSubmit={handleApply} noValidate>
                              <div className="grid grid-cols-2 gap-3 border-b border-mist-gray/70 py-4">
                                  {children}
                              </div>

                              <div className="flex justify-end pt-4">
                                  <Button type="submit" variant="secondary">
                                      Apply
                                  </Button>
                              </div>
                          </form>
                      </div>,
                      document.body
                  )
                : null}
        </div>
    );
}
