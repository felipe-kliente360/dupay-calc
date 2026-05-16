'use client';
import { srmHex } from '@/lib/brewing-math';
import { GlassType } from '@/lib/types';

const GLASS_SHAPES: Record<GlassType, { body: string; fill: string; foam: string; hi: string; base: string | null }> = {
  pint: {
    body: "M7,10 L41,10 L38,67 L10,67 Z",
    fill: "M8,10 L40,10 L37,67 L11,67 Z",
    foam: "M8,10 Q24,5 40,10 L40,17 Q24,13 8,17 Z",
    hi:   "M12,14 L10,60", base: null,
  },
  pilsner: {
    body: "M9,8 L39,8 L34,65 L14,65 Z",
    fill: "M10,8 L38,8 L33,65 L15,65 Z",
    foam: "M10,8 Q24,3 38,8 L38,15 Q24,11 10,15 Z",
    hi:   "M13,12 L11,58", base: "M12,65 L10,71 L38,71 L36,65 Z",
  },
  weizen: {
    body: "M2,8 L46,8 L36,67 L12,67 Z",
    fill: "M3,8 L45,8 L35,67 L13,67 Z",
    foam: "M3,8 Q24,2 45,8 L45,17 Q24,12 3,17 Z",
    hi:   "M7,12 L11,60", base: null,
  },
  goblet: {
    body: "M12,62 Q7,48 8,32 Q9,14 24,10 Q39,14 40,32 Q41,48 36,62 L30,62 L29,68 L38,68 L38,72 L10,72 L10,68 L19,68 L18,62 Z",
    fill: "M14,60 Q10,48 11,32 Q12,18 24,14 Q36,18 37,32 Q38,48 34,60 Z",
    foam: "M11,16 Q24,10 37,16 L37,23 Q24,18 11,23 Z",
    hi:   "M13,30 Q12,20 16,16", base: null,
  },
  tulip: {
    body: "M10,67 L9,42 Q10,28 16,16 L16,8 L32,8 L32,16 Q38,28 39,42 L38,67 Z",
    fill: "M11,67 L10,42 Q11,29 17,17 L17,9 L31,9 L31,17 Q37,29 38,42 L37,67 Z",
    foam: "M17,9 Q24,4 31,9 L31,16 Q24,12 17,16 Z",
    hi:   "M13,14 L11,55", base: null,
  },
};

export function glassTypeFromCat(cat = ''): GlassType {
  if (!cat) return 'pint';
  if (cat.includes('Trigo')) return 'weizen';
  if (cat.includes('Lager') || cat.includes('Tchec')) return 'pilsner';
  if (cat.includes('Belg') && cat.includes('Fort')) return 'goblet';
  if (cat.includes('IPA') || cat.includes('Pale') || cat.includes('Amber')) return 'tulip';
  return 'pint';
}

interface BeerGlassProps {
  srm: number;
  size?: number;
  cat?: string;
}

export function BeerGlass({ srm, size = 48, cat = '' }: BeerGlassProps) {
  const v    = Math.max(1, srm || 1);
  const hex  = srmHex(v);
  const dark = v > 16;
  const type = glassTypeFromCat(cat);
  const g    = GLASS_SHAPES[type];
  const uid  = `g${type}${Math.round(v)}`;
  const vw   = 48; const vh = 76;
  const svgH = (size / vw) * vh;
  const textY = type === 'goblet' ? 40 : 46;

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${vw} ${vh}`} fill="none" style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`liq-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={hex} stopOpacity={.72} />
          <stop offset="48%"  stopColor={hex} stopOpacity={.97} />
          <stop offset="100%" stopColor={hex} stopOpacity={.78} />
        </linearGradient>
        <linearGradient id={`foam-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFDF8" stopOpacity={1} />
          <stop offset="100%" stopColor="#EEE0B8" stopOpacity={.9} />
        </linearGradient>
      </defs>
      {g.base && <path d={g.base} fill="#E8D8A8" stroke="#C0A860" strokeWidth="1" />}
      <path d={g.fill} fill={`url(#liq-${uid})`} />
      <path d={g.foam} fill={`url(#foam-${uid})`} />
      <circle cx="14" cy="13" r="2.2" fill="white" opacity={.5} />
      <circle cx="24" cy="11" r="3.2" fill="white" opacity={.6} />
      <circle cx="34" cy="13" r="2.2" fill="white" opacity={.5} />
      <circle cx="19" cy="15" r="1.4" fill="white" opacity={.4} />
      <circle cx="29" cy="15" r="1.4" fill="white" opacity={.4} />
      <path d={g.body} stroke="#C4A870" strokeWidth="1.5" fill="none" />
      <path d={g.hi} stroke="white" strokeWidth="2" strokeLinecap="round" opacity={.2} />
      <text x="24" y={textY} textAnchor="middle"
        fill={dark ? 'rgba(255,255,255,.68)' : 'rgba(0,0,0,.42)'}
        fontSize="8" fontFamily="monospace" fontWeight="bold">
        {Math.round(v)}
      </text>
    </svg>
  );
}
