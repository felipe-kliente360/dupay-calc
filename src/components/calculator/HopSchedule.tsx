'use client';
import { T } from '@/lib/tokens';
import { HopEntry } from '@/lib/types';
import { HOPS_DB } from '@/data/hops';
import { calcUtilization } from '@/lib/brewing-math';
import { NumInput } from '@/components/ui/NumInput';
import { SectionHead } from '@/components/ui/SectionHead';
import { useState } from 'react';

interface HopScheduleProps {
  hops: HopEntry[];
  setHops: (h: HopEntry[] | ((prev: HopEntry[]) => HopEntry[])) => void;
  ibu: number;
  boilOG: number;
  batchL: number;
}

export function HopSchedule({ hops, setHops, ibu, boilOG, batchL }: HopScheduleProps) {
  const [newHopId, setNewHopId] = useState(1);

  const addHop = () => {
    const hp = HOPS_DB.find(x => x.id === newHopId);
    setHops(h => [...h, { id: Date.now(), hopId: newHopId, g: 20, time: 60, aa: hp ? parseFloat(((hp.aa[0] + hp.aa[1]) / 2).toFixed(1)) : 5 }]);
  };
  const remHop = (id: number) => setHops(h => h.filter(x => x.id !== id));
  const updHop = (id: number, f: keyof HopEntry, v: number) => setHops(h => h.map(x => x.id === id ? { ...x, [f]: v } : x));

  const sel = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 6, color: T.ink, padding: '7px 10px', fontSize: 12, fontFamily: T.body, outline: 'none', cursor: 'pointer', maxWidth: 190 };
  const addBtn = { background: T.hop, border: 'none', color: 'white', padding: '9px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 11, letterSpacing: .3, whiteSpace: 'nowrap' as const, flexShrink: 0 };
  const remBtn = { background: 'none', border: `1px solid ${T.b2}`, color: T.inkMuted, borderRadius: 6, padding: '5px 9px', cursor: 'pointer', fontFamily: T.mono, fontSize: 12, flexShrink: 0, lineHeight: 1 };

  return (
    <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.b1}`, padding: 16, marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
      <SectionHead
        title="🌿 Lúpulos"
        info={ibu > 0 ? `${ibu.toFixed(0)} IBU` : ''}
        controls={<>
          <select value={newHopId} onChange={e => setNewHopId(Number(e.target.value))} style={sel}>
            {HOPS_DB.map(h => <option key={h.id} value={h.id}>{h.name} ({h.origin})</option>)}
          </select>
          <button onClick={addHop} style={addBtn}>+ Lúpulo</button>
        </>}
      />
      {hops.length === 0 && (
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkDim, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Adicione lúpulos. Tempo 0 = aroma / dry-hop (sem IBU).
        </div>
      )}
      {hops.map(h => {
        const hp = HOPS_DB.find(x => x.id === h.hopId);
        const hopIBU = (h.g * h.aa * calcUtilization(h.time, boilOG) * 10) / (batchL || 20);
        const isDryHop = h.time === 0;
        return (
          <div key={h.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px', background: T.bgHop, borderRadius: 8, border: `1px solid ${T.b1}`, marginBottom: 6, flexWrap: 'wrap' }}>
            <div style={{ width: 3, alignSelf: 'stretch', minHeight: 32, borderRadius: 2, background: T.hop, flexShrink: 0 }} />
            <div style={{ flex: '1 1 130px', minWidth: 0 }}>
              <div style={{ fontFamily: T.body, color: T.ink, fontSize: 13, fontWeight: 600 }}>
                {hp?.name}
                <span style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, fontWeight: 400, marginLeft: 6 }}>{hp?.origin}</span>
              </div>
              <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, marginTop: 2 }}>
                {hp?.flavor}
                {isDryHop
                  ? <span style={{ color: T.hop, marginLeft: 5, fontWeight: 500 }}>· dry-hop</span>
                  : <span style={{ marginLeft: 5 }}>· <b style={{ color: T.hop }}>{hopIBU.toFixed(1)} IBU</b></span>
                }
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'flex-end' }}>
              {[
                { label: 'Qtd.', field: 'g' as const, unit: 'g',   min: 0, max: 500, step: 5  },
                { label: 'Tempo',field: 'time' as const, unit: 'min',min: 0, max: 120, step: 5  },
                { label: 'AA%',  field: 'aa' as const, unit: '%',  min: 0.5, max: 30, step: 0.1 },
              ].map(({ label, field, unit, min, max, step }) => (
                <div key={field} style={{ width: field === 'aa' ? 52 : 62 }}>
                  <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                  <NumInput value={h[field] as number} unit={unit} min={min} max={max} step={step} onChange={v => updHop(h.id, field, v)} small />
                </div>
              ))}
            </div>
            <button onClick={() => remHop(h.id)} style={remBtn} title="Remover">✕</button>
          </div>
        );
      })}
    </div>
  );
}
