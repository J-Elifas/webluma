export default function WorkspaceIllustrationSvg() {
    return (
        <svg
            viewBox="0 0 640 760"
            className="h-full w-full"
            role="img"
            aria-label="Abstract CMS workspace illustration"
        >
            <defs>
                <linearGradient id="webluma-panel-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="44%" stopColor="#E0F7FF" />
                    <stop offset="100%" stopColor="#CCFBF1" />
                </linearGradient>
                <linearGradient id="webluma-card" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F1F5F9" />
                </linearGradient>
                <linearGradient id="webluma-blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <linearGradient id="webluma-mint" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#CCFBF1" />
                    <stop offset="100%" stopColor="#99F6E4" />
                </linearGradient>
                <linearGradient id="webluma-accent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F0FDFA" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                </linearGradient>
                <filter
                    id="webluma-soft-shadow"
                    x="-18%"
                    y="-18%"
                    width="136%"
                    height="136%"
                    colorInterpolationFilters="sRGB"
                >
                    <feDropShadow
                        dx="0"
                        dy="20"
                        stdDeviation="24"
                        floodColor="#0F172A"
                        floodOpacity="0.14"
                    />
                </filter>
                <filter
                    id="webluma-subtle-shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    colorInterpolationFilters="sRGB"
                >
                    <feDropShadow
                        dx="0"
                        dy="10"
                        stdDeviation="14"
                        floodColor="#0F172A"
                        floodOpacity="0.1"
                    />
                </filter>
                <pattern id="webluma-grid" width="34" height="34" patternUnits="userSpaceOnUse">
                    <path
                        d="M34 0H0V34"
                        fill="none"
                        stroke="#38BDF8"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>

            <rect width="640" height="760" rx="36" fill="url(#webluma-panel-bg)" />
            <rect width="640" height="760" rx="36" fill="url(#webluma-grid)" />

            <circle cx="548" cy="96" r="92" fill="#FFFFFF" opacity="0.56" />
            <circle cx="98" cy="650" r="136" fill="#99F6E4" opacity="0.28" />
            <circle cx="576" cy="634" r="150" fill="#38BDF8" opacity="0.16" />
            <path
                d="M72 205C148 85 319 64 431 122c126 65 164 212 91 318-81 117-270 126-398 42C20 414 10 302 72 205Z"
                fill="#FFFFFF"
                opacity="0.42"
            />

            <g opacity="0.7">
                <path
                    d="M94 138h70m-70 28h44M504 202h62m-62 28h34M92 542h66m-66 28h38"
                    fill="none"
                    stroke="#38BDF8"
                    strokeLinecap="round"
                    strokeWidth="7"
                />
                <circle cx="515" cy="116" r="7" fill="#38BDF8" />
                <circle cx="545" cy="116" r="7" fill="#99F6E4" />
                <circle cx="575" cy="116" r="7" fill="#0F172A" opacity="0.28" />
            </g>

            <g filter="url(#webluma-soft-shadow)">
                <rect x="112" y="178" width="408" height="424" rx="30" fill="url(#webluma-card)" />
                <rect
                    x="112"
                    y="178"
                    width="408"
                    height="424"
                    rx="30"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity="0.92"
                    strokeWidth="3"
                />
                <rect x="112" y="178" width="408" height="76" rx="30" fill="#0F172A" />
                <path d="M112 224h408v30H112z" fill="#0F172A" />
                <circle cx="156" cy="216" r="9" fill="#38BDF8" />
                <circle cx="186" cy="216" r="9" fill="#99F6E4" />
                <circle cx="216" cy="216" r="9" fill="#E2E8F0" />
                <rect x="272" y="204" width="176" height="24" rx="12" fill="#1E293B" />

                <rect x="144" y="286" width="152" height="180" rx="22" fill="#E0F7FF" />
                <rect x="166" y="316" width="78" height="16" rx="8" fill="#0F172A" />
                <rect
                    x="166"
                    y="350"
                    width="98"
                    height="11"
                    rx="5.5"
                    fill="#64748B"
                    opacity="0.46"
                />
                <rect
                    x="166"
                    y="374"
                    width="72"
                    height="11"
                    rx="5.5"
                    fill="#64748B"
                    opacity="0.35"
                />
                <rect x="166" y="414" width="86" height="26" rx="13" fill="url(#webluma-blue)" />

                <rect x="324" y="286" width="164" height="74" rx="20" fill="#F8FAFC" />
                <rect x="348" y="314" width="82" height="13" rx="6.5" fill="#0F172A" />
                <rect x="348" y="338" width="104" height="10" rx="5" fill="#CBD5E1" />
                <circle cx="462" cy="323" r="14" fill="#99F6E4" />

                <rect x="324" y="388" width="164" height="78" rx="20" fill="#F8FAFC" />
                <path
                    d="M350 438c16-23 31-31 48-18 15 11 28 11 44-15 9-15 18-21 30-17"
                    fill="none"
                    stroke="#38BDF8"
                    strokeLinecap="round"
                    strokeWidth="9"
                />
                <circle cx="350" cy="438" r="7" fill="#0F172A" opacity="0.3" />
                <circle cx="472" cy="388" r="7" fill="#99F6E4" />

                <rect x="144" y="496" width="344" height="62" rx="20" fill="#F8FAFC" />
                <rect x="168" y="519" width="112" height="14" rx="7" fill="#0F172A" />
                <rect x="304" y="518" width="56" height="16" rx="8" fill="#BAE6FD" />
                <rect x="376" y="518" width="74" height="16" rx="8" fill="#CCFBF1" />
            </g>

            <g filter="url(#webluma-subtle-shadow)">
                <g transform="rotate(-8 167 327)">
                    <rect x="60" y="262" width="154" height="158" rx="28" fill="#FFFFFF" />
                    <rect
                        x="60"
                        y="262"
                        width="154"
                        height="158"
                        rx="28"
                        fill="none"
                        stroke="#BAE6FD"
                        strokeWidth="2"
                    />
                    <rect x="86" y="298" width="66" height="14" rx="7" fill="#0F172A" />
                    <rect x="86" y="330" width="92" height="10" rx="5" fill="#CBD5E1" />
                    <rect x="86" y="354" width="70" height="10" rx="5" fill="#CBD5E1" />
                    <circle cx="163" cy="384" r="21" fill="url(#webluma-mint)" />
                </g>

                <g transform="rotate(9 505 424)">
                    <rect x="448" y="324" width="132" height="202" rx="28" fill="#FFFFFF" />
                    <rect
                        x="448"
                        y="324"
                        width="132"
                        height="202"
                        rx="28"
                        fill="none"
                        stroke="#CCFBF1"
                        strokeWidth="2"
                    />
                    <rect
                        x="478"
                        y="356"
                        width="72"
                        height="72"
                        rx="20"
                        fill="url(#webluma-accent)"
                    />
                    <path
                        d="M493 401l20-24 20 17 17-22"
                        fill="none"
                        stroke="#38BDF8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="8"
                    />
                    <rect x="476" y="458" width="76" height="12" rx="6" fill="#0F172A" />
                    <rect x="476" y="484" width="54" height="10" rx="5" fill="#CBD5E1" />
                </g>
            </g>

            <g>
                <path
                    d="M180 616c66 42 214 45 292 3"
                    fill="none"
                    stroke="#0F172A"
                    strokeOpacity="0.08"
                    strokeLinecap="round"
                    strokeWidth="26"
                />
                <path
                    d="M174 610c78 44 224 44 304 0"
                    fill="none"
                    stroke="#38BDF8"
                    strokeLinecap="round"
                    strokeWidth="9"
                />
                <circle cx="174" cy="610" r="12" fill="#FFFFFF" />
                <circle cx="174" cy="610" r="6" fill="#38BDF8" />
                <circle cx="478" cy="610" r="12" fill="#FFFFFF" />
                <circle cx="478" cy="610" r="6" fill="#99F6E4" />
            </g>

            <g filter="url(#webluma-subtle-shadow)">
                <circle cx="312" cy="642" r="42" fill="#0F172A" />
                <path
                    d="M292 642h40m-20-20v40"
                    stroke="#FFFFFF"
                    strokeLinecap="round"
                    strokeWidth="10"
                />
                <circle cx="384" cy="650" r="28" fill="#FFFFFF" />
                <path
                    d="M374 650l8 8 14-18"
                    fill="none"
                    stroke="#38BDF8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="7"
                />
            </g>

            <g opacity="0.8">
                <rect
                    x="74"
                    y="474"
                    width="44"
                    height="44"
                    rx="14"
                    fill="#FFFFFF"
                    transform="rotate(14 96 496)"
                />
                <rect
                    x="522"
                    y="252"
                    width="34"
                    height="34"
                    rx="11"
                    fill="#99F6E4"
                    transform="rotate(-16 539 269)"
                />
                <path
                    d="M84 96l18 36 36 18-36 18-18 36-18-36-36-18 36-18 18-36Z"
                    fill="#FFFFFF"
                    opacity="0.78"
                />
                <path
                    d="M545 548l12 24 24 12-24 12-12 24-12-24-24-12 24-12 12-24Z"
                    fill="#FFFFFF"
                    opacity="0.84"
                />
            </g>
        </svg>
    );
}
