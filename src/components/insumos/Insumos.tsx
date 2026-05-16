'use client';
import { T } from '@/lib/tokens';
import { MALTS_DB, MALT_TYPE } from '@/data/malts';
import { HOPS_DB } from '@/data/hops';
import { YEASTS_DB } from '@/data/yeasts';
import { BeerGlass } from '@/components/ui/BeerGlass';
import { Pill } from '@/components/ui/Pill';
import { useWidth } from '@/hooks/useWidth';
import { useState } from 'react';

type Sub = 'maltes' | 'lupulos' | 'leveduras';

export function Insumos() {
  const vw = useWidth();
  const mobile = vw < 640;
  const [sub, setSub]       = useState<Sub>('maltes');
  const [search, setSearch] = useState('');

  const inp = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 7, color: T.ink, padding: '9px 12px', fontSize: 13, fontFamily: T.body, outline: 'none' };
  const tabB = (a: boolean) => ({ background: a ? T.amber : 'transparent', border: a ? 'none' : `1px solid ${T.b2}`, color: a ? 'white' : T.inkMuted, padding: mobile ? '8px 11px' : '8px 18px', borderRadius: 6, cursor: 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 11, letterSpacing: .5, textTransform: 'uppercase' as const, transition: 'all .2s', whiteSpace: 'nowrap' as const });
  const grid = `repeat(auto-fill,minmax(${mobile ? 255 : 275}px,1fr))`;
  const BRAND = { fermentis: { label: 'Fermentis', color: T.amber }, lallemand: { label: 'Lallemand', color: T.info } };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {([['maltes', '🌾 Maltes'], ['lupulos', '🌿 Lúpulos'], ['leveduras', '🧫 Leveduras']] as [Sub, string][]).map(([k, l]) => (
          <button key={k} onClick={() => { setSub(k); setSearch(''); }} style={tabB(sub === k)}>{l}</button>
        ))}
        <input placeholder="Buscar…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, marginLeft: 'auto', width: mobile ? '100%' : 190, fontSize: 12 }} />
      </div>

      {sub === 'maltes' && (['base', 'adjunct', 'crystal', 'roasted'] as const).map(type => {
        const list = MALTS_DB.filter(m => m.type === type && m.name.toLowerCase().includes(search.toLowerCase()));
        if (!list.length) return null;
        const t = MALT_TYPE[type];
        return (
          <div key={type} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 3, height: 16, background: t.color, borderRadius: 2 }} />
              <span style={{ fontFamily: T.serif, color: t.color, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{t.label}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 8 }}>
              {list.map(m => (
                <div key={m.id} style={{ background: T.bgCard, borderRadius: 9, padding: 13, border: `1px solid ${T.b1}`, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <div style={{ fontFamily: T.body, color: T.ink, fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                    <BeerGlass srm={m.ebc / 1.97} size={22} />
                  </div>
                  <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{m.desc}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <Pill color={t.color}>{t.label}</Pill>
                    <Pill color={T.inkMuted}>GU {m.gu}</Pill>
                    <Pill color={T.special}>{m.ebc} EBC</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {sub === 'lupulos' && (
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 8 }}>
          {HOPS_DB.filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.origin.toLowerCase().includes(search.toLowerCase())).map(h => (
            <div key={h.id} style={{ background: T.bgCard, borderRadius: 9, padding: 13, border: `1px solid ${T.b1}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
                <div style={{ fontFamily: T.body, color: T.ink, fontWeight: 600, fontSize: 13 }}>{h.name}</div>
                <Pill color={T.hop}>{h.origin}</Pill>
              </div>
              <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{h.flavor}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <Pill color={T.ok}>AA: {h.aa[0]}–{h.aa[1]}%</Pill>
                <Pill color={T.inkMuted}>{h.use}</Pill>
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === 'leveduras' && (() => {
        const q = search.toLowerCase();
        const filtered = YEASTS_DB.filter(y => y.name.toLowerCase().includes(q) || y.type.toLowerCase().includes(q) || y.code.toLowerCase().includes(q));
        return (['fermentis', 'lallemand'] as const).map(brand => {
          const list = filtered.filter(y => y.brand === brand);
          if (!list.length) return null;
          const bm = BRAND[brand];
          return (
            <div key={brand} style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 3, height: 18, background: bm.color, borderRadius: 2 }} />
                <span style={{ fontFamily: T.serif, color: bm.color, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{bm.label}</span>
                <span style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 10 }}>· {list.length} leveduras</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 8 }}>
                {list.map(y => (
                  <div key={y.id} style={{ background: T.bgCard, borderRadius: 9, padding: 13, border: `1px solid ${T.b1}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
                      <div>
                        <div style={{ fontFamily: T.mono, color: bm.color, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{y.code}</div>
                        <div style={{ fontFamily: T.body, color: T.ink, fontWeight: 600, fontSize: 13 }}>{y.name}</div>
                      </div>
                      <Pill color={bm.color}>{bm.label}</Pill>
                    </div>
                    <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.55, marginBottom: 8 }}>{y.desc}</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Pill color={T.special}>{y.type}</Pill>
                      <Pill color={T.ok}>Aten. {y.atten[0]}–{y.atten[1]}%</Pill>
                      <Pill color={T.info}>{y.temp[0]}–{y.temp[1]}°C</Pill>
                      <Pill color={T.copper}>Floc. {y.floc}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
}
