"use client";

import { LogOut, MoreHorizontal } from "lucide-react";

interface ProfileMenuProps {
    name: string;
    email: string;
    onLogout: () => void;
}

export default function ProfileMenu({ name, email, onLogout }: ProfileMenuProps) {
    return (
        <details className="group relative rounded-2xl border border-mist-gray/70 bg-white p-3 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.5)]">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-luma-blue [&::-webkit-details-marker]:hidden">
                <div
                    className="h-11 w-11 shrink-0 rounded-full border border-dashed border-mist-gray bg-cloud-white"
                    aria-label="Profile picture placeholder"
                    role="img"
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-midnight-slate">{name}</p>
                    <p className="truncate text-xs font-medium text-slate-gray">{email}</p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-gray transition-colors group-hover:bg-cloud-white group-hover:text-midnight-slate">
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                </span>
            </summary>

            <div className="absolute bottom-[calc(100%+0.75rem)] right-0 z-20 w-48 rounded-2xl border border-mist-gray/70 bg-white p-2 shadow-[0_24px_54px_-26px_rgba(15,23,42,0.35)]">
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-midnight-slate transition-colors hover:bg-cloud-white focus:outline-none focus:ring-2 focus:ring-luma-blue"
                >
                    <LogOut className="h-4 w-4 text-slate-gray" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </details>
    );
}
