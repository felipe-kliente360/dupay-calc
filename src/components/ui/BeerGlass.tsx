'use client';
import { srmHex } from '@/lib/brewing-math';
import { GlassType } from '@/lib/types';

// Todos os copos têm boca RETA no topo (linha horizontal).
// A espuma pende para baixo a partir da linha, não sobe acima dela.
// viewBox: 0 0 48 76

const GLASS_SHAPES: Record<GlassType, {
  body: string; fill: string; foam: string; hi: string;
  base: string | null; textY: number;
}> = {

  pint: {
    // Shaker pint — trapézio, mais largo no topo, boca reta
    body: "M9,8 L39,8 L34,67 L14,67 Z",
    fill: "M10,8 L38,8 L33,67 L15,67 Z",
    foam: "M10,8 L38,8 L38,17 Q24,21 10,17 Z",
    hi:   "M13,15 L11,60",
    base: null,
    textY: 48,
  },

  pilsner: {
    // Pilsner — estreito na base, abre para cima, boca reta, com pé
    body: "M10,8 L38,8 L36,38 L34,66 L14,66 L12,38 Z",
    fill: "M11,8 L37,8 L35,38 L33,66 L15,66 L13,38 Z",
    foam: "M11,8 L37,8 L37,17 Q24,21 11,17 Z",
    hi:   "M13,15 L14,58",
    base: "M12,66 L10,72 L38,72 L36,66 Z",
    textY: 46,
  },

  weizen: {
    // Weizen — S-curve clássica: muito larga no topo, afunila no meio, base estreita, boca reta
    body: "M2,8 L46,8 L45,20 Q38,34 34,46 Q32,56 33,64 L32,67 L16,67 L15,64 Q16,56 14,46 Q10,34 3,20 Z",
    fill: "M3,8 L45,8 L44,20 Q37,34 33,46 Q31,56 32,64 L31,67 L17,67 L16,64 Q17,56 15,46 Q11,34 4,20 Z",
    foam: "M3,8 L45,8 L45,18 Q24,22 3,18 Z",
    hi:   "M5,16 L8,42",
    base: null,
    textY: 52,
  },

  tulip: {
    // Tulip / IPA — boca reta, afunila levemente logo abaixo, bulge na parte inferior
    body: "M8,8 L40,8 L39,22 Q42,36 42,50 Q42,60 36,67 L12,67 Q6,60 6,50 Q6,36 9,22 Z",
    fill: "M9,8 L39,8 L38,22 Q41,36 41,50 Q41,60 35,67 L13,67 Q7,60 7,50 Q7,36 10,22 Z",
    foam: "M9,8 L39,8 L39,17 Q24,21 9,17 Z",
    hi:   "M9,16 L8,52",
    base: null,
    textY: 48,
  },

  goblet: {
    // Cálice belga — boca reta larga, bowl arredondado, haste, pé largo
    body: "M7,8 L41,8 Q45,22 43,36 Q41,50 30,56 L29,64 L38,64 L38,68 L10,68 L10,64 L19,64 L18,56 Q7,50 5,36 Q3,22 7,8 Z",
    fill: "M8,8 L40,8 Q43,22 41,36 Q39,49 29,55 L28,64 L19,64 L19,55 Q9,49 7,36 Q5,22 8,8 Z",
    foam: "M8,8 L40,8 L40,17 Q24,21 8,17 Z",
    hi:   "M8,34 Q7,18 10,10",
    base: null,
    textY: 38,
  },
};

export function glassTypeFromCat(cat = ''): GlassType {
  if (!cat) return 'pint';
  const c = cat.toLowerCase();
  if (c.includes('trigo') || c.includes('weizen') || c.includes('wit')) return 'weizen';
  if (c.includes('pilsner') || c.includes('pilsen') || c.includes('lager') || c.includes('tchec') || c.includes('pils')) return 'pilsner';
  if (c.includes('belg') && (c.includes('fort') || c.includes('strong') || c.includes('tripel') || c.includes('dubbel') || c.includes('trappist') || c.includes('abbey'))) return 'goblet';
  if (c.includes('ipa') || c.includes('saison') || c.includes('pale ale') || c.includes('amber')) return 'tulip';
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
  const vh   = 76;
  const svgH = (size / vw) * vh;

  return (
    <svg width={size} height={svgH} viewBox={`0 0 ${vw} ${vh}`} fill="none"
      style={{ display: 'block', overflow: 'visible', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`liq-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={hex} stopOpacity={.6} />
          <stop offset="45%"  stopColor={hex} stopOpacity={.96} />
          <stop offset="100%" stopColor={hex} stopOpacity={.68} />
        </linearGradient>
        <linearGradient id={`foam-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#FFFDF8" stopOpacity={1} />
          <stop offset="100%" stopColor="#EDE0B5" stopOpacity={.9} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#C4A870" stopOpacity={.8} />
          <stop offset="100%" stopColor="#B89858" stopOpacity={.8} />
        </linearGradient>
      </defs>

      {/* Pé do copo (pilsner/goblet) */}
      {g.base && <path d={g.base} fill="#E8D8A8" stroke="#C0A860" strokeWidth="1" />}

      {/* Líquido */}
      <path d={g.fill} fill={`url(#liq-${uid})`} />

      {/* Espuma — boca reta, pende para baixo */}
      <path d={g.foam} fill={`url(#foam-${uid})`} />

      {/* Vidro */}
      <path d={g.body} stroke={`url(#glass-${uid})`} strokeWidth="1.4" fill="none" />

      {/* Brilho lateral */}
      <path d={g.hi} stroke="white" strokeWidth="2" strokeLinecap="round" opacity={.18} />

      {/* SRM value */}
      <text x="24" y={g.textY} textAnchor="middle"
        fill={dark ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.32)'}
        fontSize="7.5" fontFamily="monospace" fontWeight="bold">
        {Math.round(v)}
      </text>
    </svg>
  );
}
