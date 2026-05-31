import type { ReactNode } from "react";
import { Bell, CalendarDays, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

interface AppTopbarProps {
    mobileMenuButton?: ReactNode;
    workspaceLabel: string;
}

export default function AppTopbar({ mobileMenuButton, workspaceLabel }: AppTopbarProps) {
    return (
        <header className="flex flex-col gap-4 border-b border-mist-gray/70 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-3">
                <Button
                    aria-label="View notifications"
                    variant="secondary"
                    size="icon-lg"
                    className="relative text-slate-gray hover:text-midnight-slate focus:ring-offset-0"
                >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                </Button>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-midnight-slate">Dashboard</p>
                    <p className="truncate text-xs font-medium text-slate-gray">
                        Monday, May 25, 2026
                    </p>
                </div>

                {mobileMenuButton ? (
                    <div className="shrink-0 lg:hidden">{mobileMenuButton}</div>
                ) : null}
            </div>

            <div className="grid w-full grid-cols-2 gap-2 sm:max-w-md sm:grid-cols-2 lg:w-auto lg:max-w-none">
                <span className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-luma-blue/20 bg-luma-blue/10 px-3 text-xs font-bold text-luma-blue">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {workspaceLabel}
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    isFullWidth
                    leftIcon={
                        <CalendarDays className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                    }
                >
                    This Month
                </Button>
            </div>
        </header>
    );
}
