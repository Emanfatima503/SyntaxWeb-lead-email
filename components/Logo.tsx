// Inline SVG logo: scales with width/height, recolors via props.
export default function Logo({
  className = 'h-11 w-auto',
  textColor = '#FFFFFF',
  accent = '#3B82F6',
}: {
  className?: string;
  textColor?: string;
  accent?: string;
}) {
  return (
    <svg viewBox="0 0 228 56" className={className} role="img" aria-label="SyntaxWeb – Software House">
      <defs>
        <linearGradient id="sw-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#sw-logo-grad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 14 4 28l13 14M45 14l13 14-13 14M36 9l-10 38" />
      </g>
      <text x="70" y="32" fontSize="27" fontWeight="700" fill={textColor} textLength="152" lengthAdjust="spacingAndGlyphs" fontFamily="inherit">
        Syntax<tspan fill={accent}>Web</tspan>
      </text>
      <text x="71" y="49" fontSize="9" fontWeight="500" fill={textColor} opacity="0.75" textLength="150" lengthAdjust="spacing" fontFamily="inherit">
        SOFTWARE HOUSE
      </text>
    </svg>
  );
}
