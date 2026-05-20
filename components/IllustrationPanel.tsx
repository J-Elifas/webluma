export default function IllustrationPanel() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[1.25rem] bg-[#FDEEEB] p-5 md:min-h-[580px]">
      <svg
        viewBox="0 0 640 760"
        className="h-full w-full"
        role="img"
        aria-label="Decorative CMS themed illustration"
      >
        <defs>
          <linearGradient id="luma-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="640" height="760" rx="36" fill="url(#luma-bg)" />
        <circle cx="560" cy="94" r="64" fill="#FFFFFF" opacity="0.62" />
        <circle cx="92" cy="688" r="80" fill="#93C5FD" opacity="0.36" />

        <g transform="rotate(-14 430 160)">
          <rect
            x="316"
            y="54"
            width="220"
            height="300"
            rx="20"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="4"
          />
          <rect x="350" y="98" width="120" height="18" rx="9" fill="#E2E8F0" />
          <rect x="350" y="136" width="36" height="92" rx="8" fill="#CBD5E1" />
          <rect x="398" y="108" width="36" height="120" rx="8" fill="#94A3B8" />
          <rect x="446" y="158" width="36" height="70" rx="8" fill="#CBD5E1" />
          <rect x="350" y="248" width="130" height="58" rx="12" fill="#E2E8F0" />
        </g>

        <ellipse cx="230" cy="574" rx="192" ry="72" fill="#93C5FD" opacity="0.42" />

        <g>
          <ellipse
            cx="232"
            cy="488"
            rx="166"
            ry="158"
            fill="#FACC15"
            stroke="#9333EA"
            strokeWidth="6"
          />
          <rect
            x="130"
            y="404"
            width="202"
            height="84"
            rx="42"
            fill="#FB7185"
            stroke="#831843"
            strokeWidth="5"
          />
          <circle cx="172" cy="440" r="34" fill="#F8FAFC" stroke="#7C3AED" strokeWidth="4" />
          <circle cx="170" cy="440" r="22" fill="#0F172A" />
          <circle cx="244" cy="442" r="20" fill="#FFFFFF" />
          <circle cx="244" cy="442" r="12" fill="#38BDF8" />
          <path
            d="M172 516c28 24 90 24 118 0"
            fill="none"
            stroke="#0F172A"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        <g>
          <rect
            x="414"
            y="384"
            width="140"
            height="20"
            rx="10"
            fill="#A855F7"
            stroke="#7E22CE"
            strokeWidth="4"
          />
          <rect
            x="414"
            y="450"
            width="140"
            height="20"
            rx="10"
            fill="#A855F7"
            stroke="#7E22CE"
            strokeWidth="4"
          />
          <circle cx="388" cy="394" r="14" fill="#94A3B8" stroke="#7E22CE" strokeWidth="4" />
          <circle cx="388" cy="460" r="14" fill="#94A3B8" stroke="#7E22CE" strokeWidth="4" />
        </g>

        <g>
          <path
            d="M70 662c72-64 170-18 202 42"
            fill="none"
            stroke="#9333EA"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <circle cx="310" cy="690" r="78" fill="#FCE7F3" stroke="#DB2777" strokeWidth="6" />
          <path
            d="M284 696c20-30 48-30 68 0"
            fill="none"
            stroke="#F472B6"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
