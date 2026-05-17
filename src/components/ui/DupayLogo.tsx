'use client';

export function DupayLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      {/* Rounded square + amber border */}
      <rect x="1" y="1" width="46" height="46" rx="10.5" ry="10.5"
        fill="#111108" stroke="#C8900A" strokeWidth="2" />
      {/* Inner amber ring */}
      <rect x="4" y="4" width="40" height="40" rx="8" ry="8"
        fill="none" stroke="#C8900A" strokeWidth="0.6" />

      {/* Center hop leaf */}
      <ellipse cx="24" cy="18" rx="5" ry="8.5" fill="#2D7B10" />
      {/* Left hop leaf */}
      <ellipse cx="18" cy="22" rx="4.5" ry="7.5" fill="#1E5A08"
        transform="rotate(-42 18 22)" />
      {/* Right hop leaf */}
      <ellipse cx="30" cy="22" rx="4.5" ry="7.5" fill="#1E5A08"
        transform="rotate(42 30 22)" />
      {/* Hop cone center */}
      <circle cx="24" cy="27.5" r="2.8" fill="#1A5008" stroke="#2D7B10" strokeWidth="0.7" />

      {/* DUPAY */}
      <text x="24" y="41.5" textAnchor="middle" fill="#C8900A"
        fontSize="6.5" fontWeight="900" fontFamily="Georgia, serif" letterSpacing="1.5">
        DUPAY
      </text>
    </svg>
  );
}
