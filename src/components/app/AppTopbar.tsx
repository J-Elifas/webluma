import { Bell, CalendarDays, Sparkles } from "lucide-react";

interface AppTopbarProps {
    workspaceLabel: string;
}

export default function AppTopbar({ workspaceLabel }: AppTopbarProps) {
    return (
        <header className="flex flex-col gap-4 border-b border-mist-gray/70 px-4 py-4 pl-16 sm:pl-16 sm:pr-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="View notifications"
                    className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-mist-gray/70 bg-white text-slate-gray shadow-sm transition-colors hover:bg-cloud-white hover:text-midnight-slate focus:outline-none focus:ring-2 focus:ring-luma-blue"
                >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                </button>
                <div>
                    <p className="text-sm font-bold text-midnight-slate">Dashboard</p>
                    <p className="text-xs font-medium text-slate-gray">Monday, May 25, 2026</p>
                </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:max-w-md sm:grid-cols-2 lg:w-auto lg:max-w-none">
                <span className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-luma-blue/20 bg-luma-blue/10 px-3 text-xs font-bold text-luma-blue">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {workspaceLabel}
                </span>
                <button
                    type="button"
                    className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-mist-gray/70 bg-white px-3.5 text-sm font-bold text-midnight-slate shadow-sm transition-colors hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue"
                >
                    <CalendarDays className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                    This Month
                </button>
            </div>
        </header>
    );
}
