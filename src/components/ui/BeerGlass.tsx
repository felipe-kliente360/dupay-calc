'use client';
import { srmHex } from '@/lib/brewing-math';
import { GlassType } from '@/lib/types';

const GLASS_SHAPES: Record<GlassType, { body: string; fill: string; foam: string; hi: string; base: string | null }> = {
  pint: {
    // Shaker pint — trapézio clássico mais largo no topo
    body: "M6,67 L42,67 L38,10 L10,10 Z",
    fill: "M7,67 L41,67 L37,10 L11,10 Z",
    foam: "M11,10 Q24,5 37,10 L37,18 Q24,14 11,18 Z",
    hi:   "M13,16 L11,60",
    base: null,
  },
  pilsner: {
    // Pilsner — base estreita, abre gradualmente
    body: "M14,67 L34,67 L36,50 L38,10 L10,10 L12,50 Z",
    fill: "M15,67 L33,67 L35,50 L37,10 L11,10 L13,50 Z",
    foam: "M11,10 Q24,5 37,10 L37,18 Q24,14 11,18 Z",
    hi:   "M13,16 L13,58",
    base: "M11,67 L9,73 L39,73 L37,67 Z",
  },
  weizen: {
    // Weizen — talo estreito na base, abre muito na parte superior
    body: "M4,67 L44,67 L44,55 Q44,42 36,28 Q30,14 24,10 Q18,14 12,28 Q4,42 4,55 Z",
    fill: "M5,67 L43,67 L43,55 Q43,43 35,29 Q29,16 24,12 Q19,16 13,29 Q5,43 5,55 Z",
    foam: "M13,12 Q24,6 35,12 L34,20 Q24,16 14,20 Z",
    hi:   "M6,60 L8,30",
    base: null,
  },
  goblet: {
    // Goblet / Cálice belga — esférico com haste
    body: "M14,62 Q6,50 7,34 Q8,16 24,11 Q40,16 41,34 Q42,50 34,62 L30,62 L29,68 L38,68 L38,72 L10,72 L10,68 L19,68 L18,62 Z",
    fill: "M15,60 Q9,50 10,34 Q11,20 24,15 Q37,20 38,34 Q39,50 33,60 Z",
    foam: "M11,17 Q24,10 37,17 L36,24 Q24,19 12,24 Z",
    hi:   "M12,50 Q11,30 14,18",
    base: null,
  },
  tulip: {
    // Tulip / IPA — copo bulboso oval, SEM pescoço reto de garrafa
    body: "M11,67 L37,67 Q42,62 42,52 Q43,38 37,24 Q31,10 24,8 Q17,10 11,24 Q5,38 6,52 Q6,62 11,67 Z",
    fill: "M12,67 L36,67 Q41,62 41,52 Q42,39 36,25 Q30,12 24,10 Q18,12 12,25 Q6,39 7,52 Q7,62 12,67 Z",
    foam: "M13,10 Q24,5 35,10 L34,17 Q24,13 14,17 Z",
    hi:   "M9,60 L10,30",
    base: null,
  },
};

export function glassTypeFromCat(cat = ''): GlassType {
  if (!cat) return 'pint';
  const c = cat.toLowerCase();
  if (c.includes('trigo') || c.includes('weizen') || c.includes('wit')) return 'weizen';
  if (c.includes('lager') || c.includes('pilsner') || c.includes('tchec') || c.includes('pils')) return 'pilsner';
  if ((c.includes('belg') && c.includes('fort')) || c.includes('trappist') || c.includes('abbey') || c.includes('dubbel') || c.includes('tripel')) return 'goblet';
  if (c.includes('ipa') || c.includes('pale ale') || c.includes('saison') || c.includes('amber')) return 'tulip';
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
  const vw   = 48;
  const vh   = type === 'goblet' ? 76 : 76;
  const svgH = (size / vw) * vh;

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${vw} ${vh}`} fill="none" style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`liq-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={hex} stopOpacity={.65} />
          <stop offset="45%"  stopColor={hex} stopOpacity={.96} />
          <stop offset="100%" stopColor={hex} stopOpacity={.72} />
        </linearGradient>
        <linearGradient id={`foam-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFDF8" stopOpacity={1} />
          <stop offset="100%" stopColor="#EEE0B8" stopOpacity={.85} />
        </linearGradient>
      </defs>
      {g.base && <path d={g.base} fill="#E8D8A8" stroke="#C0A860" strokeWidth="1" />}
      <path d={g.fill} fill={`url(#liq-${uid})`} />
      <path d={g.foam} fill={`url(#foam-${uid})`} />
      {/* Foam bubbles */}
      <circle cx="14" cy="13" r="2.2" fill="white" opacity={.45} />
      <circle cx="24" cy="11" r="3.0" fill="white" opacity={.55} />
      <circle cx="34" cy="13" r="2.2" fill="white" opacity={.45} />
      <circle cx="19" cy="15" r="1.4" fill="white" opacity={.35} />
      <circle cx="29" cy="15" r="1.4" fill="white" opacity={.35} />
      {/* Glass outline */}
      <path d={g.body} stroke="#B8986A" strokeWidth="1.4" fill="none" />
      {/* Highlight */}
      <path d={g.hi} stroke="white" strokeWidth="2" strokeLinecap="round" opacity={.18} />
      {/* SRM value */}
      <text x="24" y="52" textAnchor="middle"
        fill={dark ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.35)'}
        fontSize="7.5" fontFamily="monospace" fontWeight="bold">
        {Math.round(v)}
      </text>
    </svg>
  );
}
