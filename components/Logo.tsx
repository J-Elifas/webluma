interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 340, height = 92, className }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 460 122"
      fill="none"
      role="img"
      aria-label="Webluma"
      className={className}
    >
      <rect x="2" y="93" width="456" height="14" rx="7" fill="#E2E8F0" opacity="0.22" />
      <text
        x="6"
        y="92"
        fontSize="98"
        fontWeight="800"
        letterSpacing="-2.5"
        style={{ fontFamily: 'var(--font-geist-sans), "Segoe UI", sans-serif' }}
      >
        <tspan fill="#0F172A">Web</tspan>
        <tspan fill="#38BDF8">luma</tspan>
      </text>
    </svg>
  );
}
