interface AppPlaceholderProps {
    title: string;
}

export default function AppPlaceholder({ title }: AppPlaceholderProps) {
    return (
        <section className="rounded-[1.25rem] border border-mist-gray/70 bg-white p-6 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.45)]">
            <p className="text-xs font-bold uppercase text-slate-gray">Placeholder</p>
            <h1 className="mt-2 text-2xl font-black text-midnight-slate">{title}</h1>
        </section>
    );
}
