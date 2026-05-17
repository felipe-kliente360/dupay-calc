'use client';
import { T, card } from '@/lib/tokens';
import { GrainEntry, HopEntry, BJCPStyle } from '@/lib/types';
import { midOf } from '@/lib/brewing-math';
import { NumInput } from '@/components/ui/NumInput';
import { SField } from '@/components/ui/SField';
import { useState } from 'react';
import { useWidth } from '@/hooks/useWidth';

interface HitTargetProps {
  style: BJCPStyle | undefined;
  og: number;
  ibu: number;
  avgAtten: number;
  grains: GrainEntry[];
  setGrains: (g: GrainEntry[] | ((prev: GrainEntry[]) => GrainEntry[])) => void;
  hops: HopEntry[];
  setHops: (h: HopEntry[] | ((prev: HopEntry[]) => HopEntry[])) => void;
}

export function HitTarget({ style, og, ibu, avgAtten, grains, setGrains, hops, setHops }: HitTargetProps) {
  const vw = useWidth();
  const mobile = vw < 768;
  const [abvT, setAbvT] = useState(0);
  const [ibuT, setIbuT] = useState(0);

  const curAbv = og > 1.001 ? ((og - 1) * (avgAtten / 100) * 131.25).toFixed(1) : null;
  const curIbu = ibu > 0.5  ? ibu.toFixed(0) : null;

  const hitCenter = () => {
    if (!style) return;
    if (grains.length > 0 && og > 1.001) {
      const s = (midOf(style.og[0], style.og[1]) - 1) / (og - 1);
      setGrains(g => g.map(x => ({ ...x, kg: Math.round(x.kg * s * 100) / 100 })));
    }
    if (hops.length > 0 && ibu > 0.1) {
      const s = midOf(style.ibu[0], style.ibu[1]) / ibu;
      setHops(h => h.map(x => ({ ...x, g: Math.round(x.g * s) })));
    }
  };

  const applyABV = () => {
    if (!abvT || !grains.length || og <= 1.001) return;
    const tOG = 1 + abvT / ((avgAtten / 100) * 131.25);
    const s = (tOG - 1) / (og - 1);
    setGrains(g => g.map(x => ({ ...x, kg: Math.round(x.kg * s * 100) / 100 })));
  };

  const applyIBU = () => {
    if (!ibuT || !hops.length || ibu < 0.1) return;
    const s = ibuT / ibu;
    setHops(h => h.map(x => ({ ...x, g: Math.round(x.g * s) })));
  };

  const btn = (bg: string) => ({ border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 12, padding: '9px 16px', letterSpacing: .3, background: bg, color: 'white', whiteSpace: 'nowrap' as const });

  if (mobile) {
    return (
      <div style={{ ...card, border: `1.5px dashed ${T.b2}`, marginBottom: 12 }}>
        <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 12 }}>🎯 Atingir Meta</div>
        <div style={{ background: T.bgAmber, borderRadius: 9, padding: 12, border: `1px solid ${T.b2}`, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>Centro do Estilo</div>
              {style && <div style={{ fontFamily: T.mono, color: T.inkMid, fontSize: 11 }}>
                OG <b style={{ color: T.amber }}>{midOf(style.og[0], style.og[1]).toFixed(3)}</b>
                <span style={{ margin: '0 6px', color: T.inkDim }}>·</span>
                IBU <b style={{ color: T.ok }}>{Math.round(midOf(style.ibu[0], style.ibu[1]))}</b>
              </div>}
            </div>
            <button onClick={hitCenter} style={{ ...btn(T.amber), flexShrink: 0 }}>⚡ Centralizar</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: T.bgMuted, borderRadius: 9, padding: 10, border: `1px solid ${T.b1}` }}>
            <div style={{ fontFamily: T.mono, color: T.info, fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
              🍺 ABV alvo{curAbv && <span style={{ color: T.inkDim, fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}> ({curAbv}%)</span>}
            </div>
            <NumInput value={abvT} unit="%" min={0.5} max={20} step={0.1} onChange={v => setAbvT(v)} small />
            {style && <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginTop: 5 }}>faixa: {style.abv[0]}–{style.abv[1]}%</div>}
            <button onClick={applyABV} style={{ ...btn(T.info), width: '100%', marginTop: 8, fontSize: 11, padding: '7px 10px' }}>⚡ Aplicar</button>
          </div>
          <div style={{ background: T.bgMuted, borderRadius: 9, padding: 10, border: `1px solid ${T.b1}` }}>
            <div style={{ fontFamily: T.mono, color: T.hop, fontSize: 9, fontWeight: 500, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
              🌿 IBU alvo{curIbu && <span style={{ color: T.inkDim, fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}> ({curIbu})</span>}
            </div>
            <NumInput value={ibuT} unit="IBU" min={1} max={300} step={1} onChange={v => setIbuT(v)} small />
            {style && <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginTop: 5 }}>faixa: {style.ibu[0]}–{style.ibu[1]}</div>}
            <button onClick={applyIBU} style={{ ...btn(T.hop), width: '100%', marginTop: 8, fontSize: 11, padding: '7px 10px' }}>⚡ Aplicar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...card, border: `1.5px dashed ${T.b2}`, marginBottom: 12 }}>
      <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 14 }}>🎯 Atingir Meta</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div style={{ background: T.bgAmber, borderRadius: 9, padding: 12, border: `1px solid ${T.b2}` }}>
          <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Centro do Estilo</div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
            Ajusta grãos e lúpulos para o ponto central dos parâmetros BJCP.
          </div>
          {style && <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginBottom: 10 }}>OG → {midOf(style.og[0], style.og[1]).toFixed(3)} · IBU → {Math.round(midOf(style.ibu[0], style.ibu[1]))}</div>}
          <button onClick={hitCenter} style={{ ...btn(T.amber), width: '100%' }}>⚡ Centralizar</button>
        </div>
        <div style={{ background: T.bgMuted, borderRadius: 9, padding: 12, border: `1px solid ${T.b1}` }}>
          <div style={{ fontFamily: T.mono, color: T.info, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            Meta de ABV{curAbv && <span style={{ color: T.inkDim, fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}> ({curAbv}%)</span>}
          </div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>Escala o grist para atingir o álcool desejado.</div>
          <SField label="ABV desejado">
            <NumInput value={abvT} unit="%" min={0.5} max={20} step={0.1} onChange={v => setAbvT(v)} small />
          </SField>
          {style && <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginTop: 6 }}>faixa: {style.abv[0]}–{style.abv[1]}%</div>}
          <button onClick={applyABV} style={{ ...btn(T.info), width: '100%', marginTop: 10 }}>⚡ Aplicar ABV</button>
        </div>
        <div style={{ background: T.bgMuted, borderRadius: 9, padding: 12, border: `1px solid ${T.b1}` }}>
          <div style={{ fontFamily: T.mono, color: T.hop, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            Meta de IBU{curIbu && <span style={{ color: T.inkDim, fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}> ({curIbu})</span>}
          </div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>Escala lúpulos proporcionalmente ao IBU alvo.</div>
          <SField label="IBU desejado">
            <NumInput value={ibuT} unit="IBU" min={1} max={300} step={1} onChange={v => setIbuT(v)} small />
          </SField>
          {style && <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginTop: 6 }}>faixa: {style.ibu[0]}–{style.ibu[1]}</div>}
          <button onClick={applyIBU} style={{ ...btn(T.hop), width: '100%', marginTop: 10 }}>⚡ Aplicar IBU</button>
        </div>
      </div>
    </div>
  );
}
