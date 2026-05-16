'use client';
import { T } from '@/lib/tokens';
import { BJCPStyle } from '@/lib/types';
import { BJCP_STYLES } from '@/data/bjcp-styles';
import { midOf } from '@/lib/brewing-math';
import { BeerGlass } from '@/components/ui/BeerGlass';
import { useWidth } from '@/hooks/useWidth';
import { useState } from 'react';

export function StyleGuide() {
  const vw = useWidth();
  const mobile = vw < 640;
  const [search, setSearch] = useState('');
  const [cat, setCat]       = useState('Todos');
  const [selected, setSelected] = useState<BJCPStyle | null>(null);

  const cats = ['Todos', ...Array.from(new Set(BJCP_STYLES.map(s => s.cat)))];
  const filtered = BJCP_STYLES.filter(s => {
    const q = search.toLowerCase();
    return (cat === 'Todos' || s.cat === cat) && (s.name.toLowerCase().includes(q) || s.id.includes(q) || s.cat.toLowerCase().includes(q));
  });

  const inp = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 7, color: T.ink, padding: '9px 12px', fontSize: 13, fontFamily: T.body, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input placeholder="Buscar estilo…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: 180 }} />
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp, width: 'auto' }}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 11, display: 'flex', alignItems: 'center' }}>{filtered.length} estilos</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill,minmax(${mobile ? 260 : 290}px,1fr))`, gap: 10 }}>
        {filtered.map(s => {
          const m    = midOf(s.srm[0], s.srm[1]);
          const open = selected?.id === s.id;
          return (
            <div key={s.id} onClick={() => setSelected(open ? null : s)} style={{ background: open ? T.bgAmber : T.bgCard, borderRadius: 11, border: `1.5px solid ${open ? T.amber : T.b1}`, padding: 14, cursor: 'pointer', transition: 'all .2s', boxShadow: open ? `0 2px 12px rgba(184,114,16,.12)` : '0 1px 3px rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 11, fontWeight: 500 }}>{s.id}</div>
                  <div style={{ fontFamily: T.serif, color: T.ink, fontWeight: 700, fontSize: 15, lineHeight: 1.2, marginTop: 2 }}>{s.name}</div>
                  <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, marginTop: 3, letterSpacing: .3 }}>{s.cat}</div>
                </div>
                <BeerGlass srm={m} size={32} cat={s.cat} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
                {([['OG', `${s.og[0]}`, T.amber], ['FG', `${s.fg[0]}`, T.inkMuted], ['IBU', `${s.ibu[0]}–${s.ibu[1]}`, T.ok], ['SRM', `${s.srm[0]}–${s.srm[1]}`, T.special], ['ABV', `${s.abv[0]}–${s.abv[1]}`, T.wheat]] as [string,string,string][]).map(([l, v, c]) => (
                  <div key={l} style={{ background: T.bgMuted, borderRadius: 5, padding: '4px', textAlign: 'center', border: `1px solid ${T.b1}` }}>
                    <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 7, letterSpacing: .8 }}>{l}</div>
                    <div style={{ fontFamily: T.mono, color: c, fontSize: 10, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              {open && (
                <div style={{ borderTop: `1px solid ${T.b1}`, paddingTop: 12, marginTop: 12 }}>
                  <p style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 13, lineHeight: 1.7, margin: '0 0 12px' }}>{s.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {([['Dens. Original', `${s.og[0]} – ${s.og[1]}`], ['Dens. Final', `${s.fg[0]} – ${s.fg[1]}`], ['Amargor IBU', `${s.ibu[0]} – ${s.ibu[1]}`], ['Cor SRM', `${s.srm[0]} – ${s.srm[1]}`], ['Cor EBC', `${Math.round(s.srm[0] * 1.97)} – ${Math.round(s.srm[1] * 1.97)}`], ['Teor Álc.', `${s.abv[0]} – ${s.abv[1]}%`]] as [string,string][]).map(([l, v]) => (
                      <div key={l} style={{ background: T.bgCard, borderRadius: 6, padding: '8px 10px', border: `1px solid ${T.b1}` }}>
                        <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, letterSpacing: .5 }}>{l}</div>
                        <div style={{ fontFamily: T.mono, color: T.amber, fontWeight: 500, fontSize: 13, marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
