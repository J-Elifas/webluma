"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import FieldLabel from "./FieldLabel";
import { fieldControlClasses } from "./field-styles";

interface DateInputFieldProps {
    id: string;
    label: ReactNode;
    name?: string;
    value?: string;
    defaultValue?: string;
    min?: string;
    max?: string;
    placeholder?: string;
    error?: string;
    isRequired?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    triggerClassName?: string;
    labelClassName?: string;
    calendarLabel?: string;
    onValueChange?: (value: string) => void;
}

interface CalendarCell {
    value: string;
    date: Date;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    disabled: boolean;
}

type CalendarView = "date" | "month" | "year";

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const dateValuePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateValue(value?: string) {
    if (!value) {
        return null;
    }

    const match = dateValuePattern.exec(value);

    if (!match) {
        return null;
    }

    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string) {
    const date = parseDateValue(value);

    if (!date) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatMonthLabel(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(date);
}

function toMonthStart(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addYears(date: Date, amount: number) {
    return new Date(date.getFullYear() + amount, date.getMonth(), 1);
}

function isOutsideRange(value: string, min?: string, max?: string) {
    return Boolean((min && value < min) || (max && value > max));
}

function isMonthOutsideRange(year: number, monthIndex: number, min?: string, max?: string) {
    const monthStart = formatDateValue(new Date(year, monthIndex, 1));
    const monthEnd = formatDateValue(new Date(year, monthIndex + 1, 0));

    return Boolean((max && monthStart > max) || (min && monthEnd < min));
}

function isYearOutsideRange(year: number, min?: string, max?: string) {
    return Boolean((max && `${year}-01-01` > max) || (min && `${year}-12-31` < min));
}

function getCalendarCells(viewMonth: Date, selectedValue: string, min?: string, max?: string) {
    const monthStart = toMonthStart(viewMonth);
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - monthStart.getDay());
    const todayValue = formatDateValue(new Date());

    return Array.from({ length: 42 }, (_, index): CalendarCell => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + index);
        const value = formatDateValue(date);

        return {
            value,
            date,
            isCurrentMonth: date.getMonth() === viewMonth.getMonth(),
            isSelected: value === selectedValue,
            isToday: value === todayValue,
            disabled: isOutsideRange(value, min, max),
        };
    });
}

function getYearRange(viewMonth: Date) {
    const startYear = viewMonth.getFullYear() - 5;

    return Array.from({ length: 12 }, (_, index) => startYear + index);
}

export default function DateInputField({
    calendarLabel,
    defaultValue = "",
    disabled = false,
    error,
    id,
    isRequired = false,
    label,
    labelClassName,
    max,
    min,
    name,
    onValueChange,
    placeholder = "Select a date",
    triggerClassName,
    value,
    wrapperClassName,
}: DateInputFieldProps) {
    const calendarId = useId();
    const errorId = `${id}-error`;
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? value : internalValue;
    const selectedDate = parseDateValue(selectedValue);
    const [viewMonth, setViewMonth] = useState(() =>
        toMonthStart(selectedDate ?? parseDateValue(min) ?? new Date())
    );
    const [calendarView, setCalendarView] = useState<CalendarView>("date");
    const [isOpen, setIsOpen] = useState(false);
    const [isCalendarRendered, setIsCalendarRendered] = useState(false);
    const accessibleCalendarLabel =
        calendarLabel ?? (typeof label === "string" ? `${label} date picker` : "Date picker");
    const calendarCells = useMemo(
        () => getCalendarCells(viewMonth, selectedValue, min, max),
        [max, min, selectedValue, viewMonth]
    );
    const todayValue = formatDateValue(new Date());
    const canSelectToday = !isOutsideRange(todayValue, min, max);
    const yearRange = useMemo(() => getYearRange(viewMonth), [viewMonth]);

    function moveCalendar(direction: 1 | -1) {
        if (calendarView === "date") {
            setViewMonth((currentMonth) => addMonths(currentMonth, direction));
            return;
        }

        if (calendarView === "month") {
            setViewMonth((currentMonth) => addYears(currentMonth, direction));
            return;
        }

        setViewMonth((currentMonth) => addYears(currentMonth, direction * 12));
    }

    function getPreviousLabel() {
        if (calendarView === "date") {
            return "Previous month";
        }

        if (calendarView === "month") {
            return "Previous year";
        }

        return "Previous year range";
    }

    function getNextLabel() {
        if (calendarView === "date") {
            return "Next month";
        }

        if (calendarView === "month") {
            return "Next year";
        }

        return "Next year range";
    }

    function getHeaderLabel() {
        if (calendarView === "date") {
            return formatMonthLabel(viewMonth);
        }

        if (calendarView === "month") {
            return String(viewMonth.getFullYear());
        }

        return `${yearRange[0]} - ${yearRange[yearRange.length - 1]}`;
    }

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

    function openCalendar() {
        if (disabled) {
            return;
        }

        const nextSelectedDate = parseDateValue(selectedValue);
        setViewMonth(toMonthStart(nextSelectedDate ?? parseDateValue(min) ?? viewMonth));
        setCalendarView("date");
        setIsCalendarRendered(true);
        window.requestAnimationFrame(() => setIsOpen(true));
    }

    function closeCalendar() {
        setIsOpen(false);
    }

    function setDateValue(nextValue: string) {
        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
    }

    function selectDate(nextValue: string) {
        setDateValue(nextValue);
        const nextDate = parseDateValue(nextValue);

        if (nextDate) {
            setViewMonth(toMonthStart(nextDate));
        }

        triggerRef.current?.focus();
        closeCalendar();
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
                    closeCalendar();
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
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    aria-controls={calendarId}
                    aria-describedby={error ? errorId : undefined}
                    onClick={() => {
                        if (isOpen) {
                            closeCalendar();
                            return;
                        }

                        openCalendar();
                    }}
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
                            selectedValue ? "text-midnight-slate" : "text-slate-gray/75"
                        )}
                    >
                        {selectedValue ? formatDisplayDate(selectedValue) : placeholder}
                    </span>
                    <CalendarDays
                        className={cn(
                            "h-4 w-4 shrink-0 text-slate-gray transition-colors duration-200 ease-out",
                            isOpen && "text-luma-blue"
                        )}
                        aria-hidden="true"
                    />
                </button>
                {isCalendarRendered ? (
                    <div
                        id={calendarId}
                        role="dialog"
                        aria-label={accessibleCalendarLabel}
                        onTransitionEnd={(event) => {
                            if (event.target === event.currentTarget && !isOpen) {
                                setIsCalendarRendered(false);
                            }
                        }}
                        className={cn(
                            "absolute top-full left-0 right-0 z-40 mt-2 origin-top rounded-xl border border-mist-gray/80 bg-white p-3 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.55)] transition-[opacity,transform] duration-150 ease-out",
                            isOpen
                                ? "translate-y-0 scale-100 opacity-100"
                                : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
                        )}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <button
                                type="button"
                                tabIndex={isOpen ? undefined : -1}
                                aria-label={getPreviousLabel()}
                                onClick={() => moveCalendar(-1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-gray transition-colors duration-150 hover:bg-cloud-white hover:text-midnight-slate focus:outline-none focus:ring-2 focus:ring-luma-blue/25"
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <p className="text-sm font-bold text-midnight-slate">
                                {getHeaderLabel()}
                            </p>
                            <button
                                type="button"
                                tabIndex={isOpen ? undefined : -1}
                                aria-label={getNextLabel()}
                                onClick={() => moveCalendar(1)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-gray transition-colors duration-150 hover:bg-cloud-white hover:text-midnight-slate focus:outline-none focus:ring-2 focus:ring-luma-blue/25"
                            >
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-3 rounded-xl bg-cloud-white p-1">
                            {(
                                [
                                    ["date", "Date"],
                                    ["month", "Month"],
                                    ["year", "Year"],
                                ] as const
                            ).map(([view, viewLabel]) => (
                                <button
                                    key={view}
                                    type="button"
                                    tabIndex={isOpen ? undefined : -1}
                                    aria-pressed={calendarView === view}
                                    onClick={() => setCalendarView(view)}
                                    className={cn(
                                        "rounded-lg px-2.5 py-1.5 text-xs font-bold transition-[background-color,color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-luma-blue/25",
                                        calendarView === view
                                            ? "bg-white text-midnight-slate shadow-sm"
                                            : "text-slate-gray hover:text-midnight-slate"
                                    )}
                                >
                                    {viewLabel}
                                </button>
                            ))}
                        </div>

                        {calendarView === "date" ? (
                            <div className="mt-3 grid grid-cols-7 gap-1 text-center">
                                {weekdayLabels.map((weekday) => (
                                    <span
                                        key={weekday}
                                        className="py-1 text-xs font-bold text-slate-gray"
                                    >
                                        {weekday}
                                    </span>
                                ))}
                                {calendarCells.map((cell) => (
                                    <button
                                        key={cell.value}
                                        type="button"
                                        tabIndex={isOpen ? undefined : -1}
                                        disabled={cell.disabled}
                                        aria-label={formatDisplayDate(cell.value)}
                                        aria-current={cell.isToday ? "date" : undefined}
                                        aria-pressed={cell.isSelected}
                                        onClick={() => selectDate(cell.value)}
                                        className={cn(
                                            "h-8 rounded-lg text-xs font-bold transition-[background-color,color,transform,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-luma-blue/25",
                                            cell.isSelected
                                                ? "bg-luma-blue text-white shadow-[0_10px_24px_-18px_rgba(56,189,248,0.9)]"
                                                : "text-midnight-slate hover:bg-cloud-white",
                                            !cell.isCurrentMonth &&
                                                !cell.isSelected &&
                                                "text-slate-gray/45",
                                            cell.isToday &&
                                                !cell.isSelected &&
                                                "ring-1 ring-luma-blue/35 text-luma-blue",
                                            cell.disabled &&
                                                "cursor-not-allowed bg-transparent text-slate-gray/30"
                                        )}
                                    >
                                        {cell.date.getDate()}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        {calendarView === "month" ? (
                            <div className="mt-3 grid grid-cols-3 gap-1">
                                {monthLabels.map((month, monthIndex) => {
                                    const isSelectedMonth =
                                        selectedDate?.getFullYear() === viewMonth.getFullYear() &&
                                        selectedDate.getMonth() === monthIndex;
                                    const isCurrentViewMonth = viewMonth.getMonth() === monthIndex;
                                    const isDisabled = isMonthOutsideRange(
                                        viewMonth.getFullYear(),
                                        monthIndex,
                                        min,
                                        max
                                    );

                                    return (
                                        <button
                                            key={month}
                                            type="button"
                                            tabIndex={isOpen ? undefined : -1}
                                            disabled={isDisabled}
                                            aria-pressed={isSelectedMonth}
                                            onClick={() => {
                                                setViewMonth(
                                                    new Date(viewMonth.getFullYear(), monthIndex, 1)
                                                );
                                                setCalendarView("date");
                                            }}
                                            className={cn(
                                                "h-9 rounded-lg text-xs font-bold transition-[background-color,color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-luma-blue/25",
                                                isSelectedMonth
                                                    ? "bg-luma-blue text-white shadow-[0_10px_24px_-18px_rgba(56,189,248,0.9)]"
                                                    : "text-midnight-slate hover:bg-cloud-white",
                                                isCurrentViewMonth &&
                                                    !isSelectedMonth &&
                                                    "ring-1 ring-luma-blue/35 text-luma-blue",
                                                isDisabled &&
                                                    "cursor-not-allowed bg-transparent text-slate-gray/30"
                                            )}
                                        >
                                            {month}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        {calendarView === "year" ? (
                            <div className="mt-3 grid grid-cols-3 gap-1">
                                {yearRange.map((year) => {
                                    const isSelectedYear = selectedDate?.getFullYear() === year;
                                    const isCurrentViewYear = viewMonth.getFullYear() === year;
                                    const isDisabled = isYearOutsideRange(year, min, max);

                                    return (
                                        <button
                                            key={year}
                                            type="button"
                                            tabIndex={isOpen ? undefined : -1}
                                            disabled={isDisabled}
                                            aria-pressed={isSelectedYear}
                                            onClick={() => {
                                                setViewMonth(
                                                    new Date(year, viewMonth.getMonth(), 1)
                                                );
                                                setCalendarView("month");
                                            }}
                                            className={cn(
                                                "h-9 rounded-lg text-xs font-bold transition-[background-color,color,box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-luma-blue/25",
                                                isSelectedYear
                                                    ? "bg-luma-blue text-white shadow-[0_10px_24px_-18px_rgba(56,189,248,0.9)]"
                                                    : "text-midnight-slate hover:bg-cloud-white",
                                                isCurrentViewYear &&
                                                    !isSelectedYear &&
                                                    "ring-1 ring-luma-blue/35 text-luma-blue",
                                                isDisabled &&
                                                    "cursor-not-allowed bg-transparent text-slate-gray/30"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}

                        <div className="mt-3 flex items-center justify-between border-t border-mist-gray/70 pt-3">
                            <button
                                type="button"
                                tabIndex={isOpen ? undefined : -1}
                                disabled={!selectedValue}
                                onClick={() => setDateValue("")}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-gray transition-colors duration-150 hover:bg-cloud-white hover:text-midnight-slate focus:outline-none focus:ring-2 focus:ring-luma-blue/25 disabled:cursor-not-allowed disabled:text-slate-gray/35"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                tabIndex={isOpen ? undefined : -1}
                                disabled={!canSelectToday}
                                onClick={() => selectDate(todayValue)}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-luma-blue transition-colors duration-150 hover:bg-luma-blue/10 focus:outline-none focus:ring-2 focus:ring-luma-blue/25 disabled:cursor-not-allowed disabled:text-slate-gray/35"
                            >
                                Today
                            </button>
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
