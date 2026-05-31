"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import FieldLabel from "./FieldLabel";
import { fieldControlClasses } from "./field-styles";

export interface SelectFieldOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

interface SelectFieldProps {
    id: string;
    label: string;
    options: SelectFieldOption[];
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    error?: string;
    isRequired?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    triggerClassName?: string;
    labelClassName?: string;
    onValueChange?: (value: string) => void;
}

function getSelectedIndex(options: SelectFieldOption[], value: string) {
    return options.findIndex((option) => option.value === value && !option.disabled);
}

function getFirstEnabledIndex(options: SelectFieldOption[]) {
    return options.findIndex((option) => !option.disabled);
}

function getNextEnabledIndex(
    options: SelectFieldOption[],
    currentIndex: number,
    direction: 1 | -1
) {
    if (options.length === 0) {
        return -1;
    }

    for (let offset = 1; offset <= options.length; offset += 1) {
        const nextIndex = (currentIndex + offset * direction + options.length) % options.length;

        if (!options[nextIndex]?.disabled) {
            return nextIndex;
        }
    }

    return -1;
}

export default function SelectField({
    defaultValue = "",
    disabled = false,
    error,
    id,
    isRequired = false,
    label,
    labelClassName,
    name,
    onValueChange,
    options,
    placeholder = "Select an option",
    triggerClassName,
    value,
    wrapperClassName,
}: SelectFieldProps) {
    const listboxId = useId();
    const errorId = `${id}-error`;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? value : internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);
    const selectedIndex = getSelectedIndex(options, selectedValue);
    const [activeIndex, setActiveIndex] = useState(
        selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options)
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isListboxRendered, setIsListboxRendered] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handlePointerDown(event: PointerEvent) {
            const target = event.target;

            if (target instanceof Node && wrapperRef.current?.contains(target)) {
                return;
            }

            setIsOpen(false);
        }

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isOpen]);

    function openListbox() {
        if (disabled) {
            return;
        }

        setActiveIndex(selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options));
        setIsListboxRendered(true);
        window.requestAnimationFrame(() => setIsOpen(true));
    }

    function closeListbox() {
        setIsOpen(false);
    }

    function selectValue(nextValue: string) {
        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
        triggerRef.current?.focus();
        closeListbox();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (disabled) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            openListbox();
            setActiveIndex((currentIndex) =>
                getNextEnabledIndex(
                    options,
                    currentIndex >= 0 ? currentIndex : getFirstEnabledIndex(options),
                    1
                )
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            openListbox();
            setActiveIndex((currentIndex) =>
                getNextEnabledIndex(
                    options,
                    currentIndex >= 0 ? currentIndex : getFirstEnabledIndex(options),
                    -1
                )
            );
        }

        if (event.key === "Home") {
            event.preventDefault();
            openListbox();
            setActiveIndex(getFirstEnabledIndex(options));
        }

        if (event.key === "End") {
            event.preventDefault();
            openListbox();
            setActiveIndex(
                options
                    .map((option, index) => ({ index, disabled: option.disabled }))
                    .filter((option) => !option.disabled)
                    .at(-1)?.index ?? -1
            );
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!isOpen) {
                openListbox();
                return;
            }

            const activeOption = options[activeIndex];

            if (activeOption && !activeOption.disabled) {
                selectValue(activeOption.value);
            }
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeListbox();
        }
    }

    return (
        <div
            ref={wrapperRef}
            className={cn("relative", wrapperClassName)}
            onBlur={(event) => {
                if (
                    !(event.relatedTarget instanceof Node) ||
                    !event.currentTarget.contains(event.relatedTarget)
                ) {
                    closeListbox();
                }
            }}
        >
            <FieldLabel htmlFor={id} isRequired={isRequired} className={labelClassName}>
                {label}
            </FieldLabel>
            <input type="hidden" name={name} value={selectedValue} />
            <div className="relative mt-2">
                <button
                    ref={triggerRef}
                    id={id}
                    type="button"
                    role="combobox"
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-controls={listboxId}
                    aria-activedescendant={
                        isOpen && activeIndex >= 0
                            ? `${listboxId}-option-${activeIndex}`
                            : undefined
                    }
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    aria-required={isRequired || undefined}
                    onClick={() => {
                        if (isOpen) {
                            closeListbox();
                            return;
                        }

                        openListbox();
                    }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        fieldControlClasses(Boolean(error)),
                        "flex items-center justify-between gap-3 px-3 py-2.5 text-left",
                        isOpen && "border-luma-blue ring-2 ring-luma-blue/25",
                        triggerClassName
                    )}
                >
                    <span
                        className={cn(
                            "min-w-0 truncate",
                            selectedOption ? "text-midnight-slate" : "text-slate-gray/75"
                        )}
                    >
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 shrink-0 text-slate-gray transition-transform duration-200 ease-out",
                            isOpen && "rotate-180 text-luma-blue"
                        )}
                        aria-hidden="true"
                    />
                </button>
                {isListboxRendered ? (
                    <div
                        onTransitionEnd={(event) => {
                            if (event.target === event.currentTarget && !isOpen) {
                                setIsListboxRendered(false);
                            }
                        }}
                        className={cn(
                            "absolute top-full left-0 right-0 z-40 mt-2 origin-top overflow-hidden rounded-xl border border-mist-gray/80 bg-white p-1 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.55)] transition-[opacity,transform] duration-150 ease-out",
                            isOpen
                                ? "translate-y-0 scale-100 opacity-100"
                                : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                        )}
                    >
                        <div
                            id={listboxId}
                            role="listbox"
                            aria-labelledby={id}
                            className="max-h-60 overflow-y-auto"
                        >
                            {options.map((option, index) => {
                                const isSelected = option.value === selectedValue;
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        key={option.value}
                                        id={`${listboxId}-option-${index}`}
                                        type="button"
                                        role="option"
                                        tabIndex={-1}
                                        disabled={option.disabled}
                                        aria-selected={isSelected}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => {
                                            if (!option.disabled) {
                                                selectValue(option.value);
                                            }
                                        }}
                                        className={cn(
                                            "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-[background-color,color,transform] duration-150 ease-out",
                                            isActive && "bg-cloud-white text-midnight-slate",
                                            isSelected && "bg-luma-blue/10 text-midnight-slate",
                                            option.disabled
                                                ? "cursor-not-allowed text-slate-gray/45"
                                                : "cursor-pointer text-slate-gray hover:bg-cloud-white hover:text-midnight-slate"
                                        )}
                                    >
                                        <span className="min-w-0 truncate">{option.label}</span>
                                        <Check
                                            className={cn(
                                                "h-4 w-4 shrink-0 text-luma-blue transition-opacity duration-150",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
            {error ? (
                <p id={errorId} className="mt-2 text-sm font-medium text-red-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
