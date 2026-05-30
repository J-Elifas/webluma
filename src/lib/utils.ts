import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const dateValuePattern = /^\d{4}-\d{2}-\d{2}$/;

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function toUtcDate(dateValue: string) {
    return new Date(`${dateValue}T00:00:00.000Z`);
}

export function toUtcDateValue(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function isValidDateValue(value: string) {
    const match = dateValuePattern.exec(value);

    if (!match) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export function addDaysToDateValue(value: string, amount: number) {
    if (!isValidDateValue(value)) {
        return "";
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + amount);

    return formatDateValue(date);
}

export function createInvoiceNumber(date = new Date()) {
    const dateSegment = formatDateValue(date).replaceAll("-", "");
    const timeSegment = [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((value) => String(value).padStart(2, "0"))
        .join("");

    return `INV-${dateSegment}-${timeSegment}`;
}

export function isValidHttpUrl(value: string) {
    try {
        const url = new URL(value);

        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}
