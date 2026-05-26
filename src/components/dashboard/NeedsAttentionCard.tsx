import { metricIcons, toneClasses } from "./dashboard-icons";
import type { DashboardAttentionItem } from "@/server/dashboard/types";

interface NeedsAttentionCardProps {
    items: DashboardAttentionItem[];
}

export default function NeedsAttentionCard({ items }: NeedsAttentionCardProps) {
    return (
        <article className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <h2 className="text-lg font-black text-midnight-slate">Needs attention</h2>
            <div className="mt-5 space-y-4">
                {items.map((item) => {
                    const Icon = metricIcons[item.icon];

                    return (
                        <div key={item.label} className="flex gap-3">
                            <span
                                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-midnight-slate">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm font-medium leading-6 text-slate-gray">
                                    {item.helper}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </article>
    );
}
