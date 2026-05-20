interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold leading-tight text-midnight-slate sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-md text-sm leading-6 text-slate-gray">{subtitle}</p>
      ) : null}
    </div>
  );
}
