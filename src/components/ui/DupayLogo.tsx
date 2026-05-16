'use client';

export function DupayLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <path id="topArcD" d="M 5.5,24 A 18.5,18.5 0 0,1 42.5,24" />
        <path id="botArcD" d="M 8,36 A 17,17 0 0,0 40,36" />
      </defs>

      {/* Background circle */}
      <circle cx="24" cy="24" r="23.5" fill="#111108" />
      {/* Outer gold ring */}
      <circle cx="24" cy="24" r="23" fill="none" stroke="#C8900A" strokeWidth="1.4" />
      {/* Inner gold ring */}
      <circle cx="24" cy="24" r="20.2" fill="none" stroke="#C8900A" strokeWidth="0.5" />

      {/* CERVECERIA top arc */}
      <text fill="white" fontSize="4.2" fontFamily="'DM Mono', monospace" letterSpacing="1.4" fontWeight="500">
        <textPath href="#topArcD" startOffset="50%" textAnchor="middle">CERVECERIA</textPath>
      </text>

      {/* Wheat left stalk */}
      <line x1="8.5" y1="39" x2="7" y2="20" stroke="#C8900A" strokeWidth="0.9" />
      <ellipse cx="6.8" cy="17.5" rx="1.4" ry="2.4" fill="#C8900A" />
      <ellipse cx="9" cy="23" rx="1.3" ry="2" fill="#C8900A" transform="rotate(22 9 23)" />
      <ellipse cx="7.2" cy="28" rx="1.2" ry="1.8" fill="#C8900A" transform="rotate(-18 7.2 28)" />
      <ellipse cx="9" cy="33" rx="1.1" ry="1.6" fill="#C8900A" transform="rotate(22 9 33)" />

      {/* Wheat right stalk */}
      <line x1="39.5" y1="39" x2="41" y2="20" stroke="#C8900A" strokeWidth="0.9" />
      <ellipse cx="41.2" cy="17.5" rx="1.4" ry="2.4" fill="#C8900A" />
      <ellipse cx="39" cy="23" rx="1.3" ry="2" fill="#C8900A" transform="rotate(-22 39 23)" />
      <ellipse cx="40.8" cy="28" rx="1.2" ry="1.8" fill="#C8900A" transform="rotate(18 40.8 28)" />
      <ellipse cx="39" cy="33" rx="1.1" ry="1.6" fill="#C8900A" transform="rotate(-22 39 33)" />

      {/* Hop leaves — trefoil centered at 24,28 */}
      <ellipse cx="24" cy="22" rx="4.8" ry="7.5" fill="#1E5A08" />
      <ellipse cx="24" cy="22" rx="3.4" ry="5.5" fill="#2D7B10" />
      <ellipse cx="17.5" cy="28.5" rx="4.8" ry="7.5" fill="#1E5A08" transform="rotate(-55 17.5 28.5)" />
      <ellipse cx="17.5" cy="28.5" rx="3.4" ry="5.5" fill="#2D7B10" transform="rotate(-55 17.5 28.5)" />
      <ellipse cx="30.5" cy="28.5" rx="4.8" ry="7.5" fill="#1E5A08" transform="rotate(55 30.5 28.5)" />
      <ellipse cx="30.5" cy="28.5" rx="3.4" ry="5.5" fill="#2D7B10" transform="rotate(55 30.5 28.5)" />
      {/* Hop center */}
      <circle cx="24" cy="27" r="2.4" fill="#1A5008" />
      <circle cx="24" cy="27" r="1.4" fill="#2D7B10" />

      {/* Hat */}
      <rect x="19" y="11" width="10" height="7" rx="1.2" fill="#145A10" />
      <rect x="17" y="17.5" width="14" height="2" rx="1" fill="#1A7010" />
      {/* Hat buckle */}
      <rect x="22.2" y="15.5" width="3.6" height="2.2" rx="0.4" fill="#C8900A" />
      <rect x="22.8" y="16" width="2.4" height="1.2" rx="0.2" fill="#111" />
      {/* Shamrock */}
      <circle cx="21.5" cy="12.5" r="1.6" fill="#3BC020" opacity="0.95" />
      <circle cx="24" cy="11.4" r="1.6" fill="#3BC020" opacity="0.95" />
      <circle cx="26.5" cy="12.5" r="1.6" fill="#3BC020" opacity="0.95" />
      <line x1="24" y1="13.5" x2="24" y2="15.5" stroke="#1A7010" strokeWidth="0.9" />

      {/* Head */}
      <circle cx="24" cy="21.5" r="4.8" fill="#C8946A" />

      {/* Sunglasses */}
      <rect x="19" y="20" width="4.2" height="2.8" rx="1" fill="#0A0808" />
      <rect x="24.8" y="20" width="4.2" height="2.8" rx="1" fill="#0A0808" />
      <line x1="23.2" y1="21.4" x2="24.8" y2="21.4" stroke="#333" strokeWidth="0.7" />
      {/* Lens glint */}
      <line x1="19.8" y1="20.6" x2="21.2" y2="21.4" stroke="white" strokeWidth="0.5" opacity="0.4" />

      {/* Beard */}
      <ellipse cx="24" cy="25.5" rx="3.4" ry="2.2" fill="#1C1408" />

      {/* Bottom banner */}
      <path d="M 7,36 Q 24,45 41,36 L 41,42.5 Q 24,52 7,42.5 Z" fill="#C8900A" />

      {/* DUPAY text */}
      <text x="24" y="41.5" textAnchor="middle" fill="#111108"
        fontSize="7.2" fontWeight="800" fontFamily="Georgia, serif" letterSpacing="2">
        DUPAY
      </text>
    </svg>
  );
}
