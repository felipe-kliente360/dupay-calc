'use client';
import { T, card } from '@/lib/tokens';
import { BJCPStyle } from '@/lib/types';
import { inRange, srmHex } from '@/lib/brewing-math';
import { Gauge } from '@/components/ui/Gauge';
import { BeerGlass } from '@/components/ui/BeerGlass';

interface ResultsPanelProps {
  style: BJCPStyle | undefined;
  og: number; fg: number; ibu: number; abv: number; srm: number; ebc: number;
  cat?: string;
}

export function ResultsPanel({ style, og, fg, ibu, abv, srm, ebc, cat = '' }: ResultsPanelProps) {
  if (!style) return null;
  const checks = [inRange(og, style.og[0], style.og[1]), inRange(fg, style.fg[0], style.fg[1]), inRange(ibu, style.ibu[0], style.ibu[1]), inRange(abv, style.abv[0], style.abv[1]), inRange(srm, style.srm[0], style.srm[1])];
  const allOk = checks.every(Boolean);
  const score = checks.filter(Boolean).length;

  return (
    <div style={{ ...card, border: `1.5px solid ${allOk ? T.ok : T.bGlass}`, boxShadow: allOk ? `0 0 0 3px ${T.ok}18, 0 4px 24px rgba(0,0,0,.07)` : card.boxShadow, transition: 'all .3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 700, color: T.ink }}>Parâmetros da Receita</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: allOk ? T.ok : score >= 3 ? T.wheat : T.ng }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: allOk ? T.ok : score >= 3 ? T.wheat : T.ng }}>{score}/5 no estilo</span>
        </div>
      </div>
      <Gauge label="OG"  value={og}  min={style.og[0]}  max={style.og[1]}  dec={3} />
      <Gauge label="FG"  value={fg}  min={style.fg[0]}  max={style.fg[1]}  dec={3} />
      <Gauge label="ABV" value={abv} min={style.abv[0]} max={style.abv[1]} unit="%" dec={1} />
      <Gauge label="IBU" value={ibu} min={style.ibu[0]} max={style.ibu[1]} dec={0} />
      <Gauge label="SRM" value={srm} min={style.srm[0]} max={style.srm[1]} dec={1} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, padding: '10px 12px', background: T.bgMuted, borderRadius: 8 }}>
        <BeerGlass srm={srm} size={36} cat={cat} />
        <div>
          <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>Cor estimada</div>
          <div style={{ fontFamily: T.mono, color: srmHex(srm), fontSize: 14, fontWeight: 500, marginTop: 1 }}>{srm.toFixed(1)} SRM / {ebc.toFixed(1)} EBC</div>
          <div style={{ fontFamily: T.mono, fontSize: 9, color: inRange(srm, style.srm[0], style.srm[1]) ? T.ok : T.ng, marginTop: 2 }}>
            {inRange(srm, style.srm[0], style.srm[1]) ? '✓ Dentro do estilo' : '✗ Fora da faixa'}
            <span style={{ color: T.inkDim, marginLeft: 6 }}>({style.srm[0]}–{style.srm[1]} SRM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
