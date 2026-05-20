interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight text-midnight-slate">{title}</h1>
      {subtitle ? <p className="text-sm text-slate-gray">{subtitle}</p> : null}
    </div>
  );
}
