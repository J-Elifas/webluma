import { cn } from "@/lib/utils";

export function fieldControlClasses(isInvalid = false) {
    return cn(
        "w-full rounded-xl border bg-white text-sm text-midnight-slate shadow-[0_1px_0_rgba(15,23,42,0.02)] outline-none transition-[border-color,box-shadow,background-color,color,transform] duration-200 ease-out hover:border-slate-gray/60 disabled:cursor-not-allowed disabled:bg-cloud-white disabled:text-slate-gray",
        isInvalid
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-red-100 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
            : "border-mist-gray focus:border-luma-blue focus:ring-2 focus:ring-luma-blue/25 focus-visible:border-luma-blue focus-visible:ring-2 focus-visible:ring-luma-blue/25 focus-within:border-luma-blue focus-within:ring-2 focus-within:ring-luma-blue/25"
    );
}

export const fieldInputClasses =
    "min-w-0 flex-1 border-0 bg-transparent text-sm text-midnight-slate outline-none placeholder:text-slate-gray/75 disabled:cursor-not-allowed";

export const fieldIconClasses =
    "shrink-0 text-slate-gray transition-colors duration-200 ease-out group-focus-within:text-luma-blue";

export const fieldDividerClasses =
    "h-5 w-px shrink-0 bg-mist-gray transition-colors duration-200 ease-out group-focus-within:bg-luma-blue/35";
