import type { ReactNode } from "react";

interface AppShellProps {
    children: ReactNode;
    sidebar: ReactNode;
    topbar: ReactNode;
}

export default function AppShell({ children, sidebar, topbar }: AppShellProps) {
    return (
        <main className="app-surface min-h-screen p-3 text-midnight-slate sm:p-4 lg:p-6">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 lg:flex-row">
                {sidebar}

                <section className="min-w-0 flex-1 overflow-hidden rounded-[1.75rem] border border-mist-gray/70 bg-white/92 shadow-[0_28px_70px_-48px_rgba(15,23,42,0.55)] backdrop-blur">
                    {topbar}
                    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
                </section>
            </div>
        </main>
    );
}
