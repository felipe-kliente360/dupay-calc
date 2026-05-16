'use client';
import { T } from '@/lib/tokens';
import { GrainEntry } from '@/lib/types';
import { MALTS_DB, MALT_TYPE } from '@/data/malts';
import { NumInput } from '@/components/ui/NumInput';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { useState } from 'react';

interface GrainBillProps {
  grains: GrainEntry[];
  setGrains: (g: GrainEntry[] | ((prev: GrainEntry[]) => GrainEntry[])) => void;
  totalKg: number;
}

export function GrainBill({ grains, setGrains, totalKg }: GrainBillProps) {
  const [newMaltId, setNewMaltId] = useState(1);

  const addGrain = () => setGrains(g => [...g, { id: Date.now(), maltId: newMaltId, kg: 1.0 }]);
  const remGrain = (id: number) => setGrains(g => g.filter(x => x.id !== id));
  const updGrain = (id: number, kg: number) => setGrains(g => g.map(x => x.id === id ? { ...x, kg } : x));

  const sel = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 6, color: T.ink, padding: '7px 10px', fontSize: 12, fontFamily: T.body, width: 'auto', outline: 'none', cursor: 'pointer', maxWidth: 190 };
  const addBtn = { background: T.amber, border: 'none', color: 'white', padding: '9px 14px', borderRadius: 7, cursor: 'pointer', fontFamily: T.mono, fontWeight: 500, fontSize: 11, letterSpacing: .3, whiteSpace: 'nowrap' as const, flexShrink: 0 };
  const remBtn = { background: 'none', border: `1px solid ${T.b2}`, color: T.inkMuted, borderRadius: 6, padding: '5px 9px', cursor: 'pointer', fontFamily: T.mono, fontSize: 12, flexShrink: 0, lineHeight: 1 };

  return (
    <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.b1}`, padding: 16, marginBottom: 18, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
      <SectionHead
        title="🌾 Maltes"
        info={totalKg > 0 ? `${totalKg.toFixed(2)} kg` : ''}
        controls={<>
          <select value={newMaltId} onChange={e => setNewMaltId(Number(e.target.value))} style={sel}>
            {(['base', 'crystal', 'roasted', 'adjunct'] as const).map(t => (
              <optgroup key={t} label={MALT_TYPE[t].label}>
                {MALTS_DB.filter(m => m.type === t).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </optgroup>
            ))}
          </select>
          <button onClick={addGrain} style={addBtn}>+ Malte</button>
        </>}
      />
      {grains.length === 0 && (
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkDim, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Adicione maltes para calcular OG, cor e corpo.
        </div>
      )}
      {grains.map(g => {
        const m  = MALTS_DB.find(x => x.id === g.maltId);
        const tm = m ? MALT_TYPE[m.type] : null;
        const pct = totalKg > 0 ? (g.kg / totalKg * 100) : 0;
        return (
          <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: tm?.bg || T.bgRow, borderRadius: 8, border: `1px solid ${T.b1}`, marginBottom: 6 }}>
            <div style={{ width: 3, alignSelf: 'stretch', minHeight: 32, borderRadius: 2, background: tm?.color || T.b2, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: T.body, color: T.ink, fontSize: 13, fontWeight: 600 }}>{m?.name}</span>
                <Pill color={tm?.color || T.inkMuted}>{tm?.label}</Pill>
              </div>
              <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, marginTop: 2 }}>{m?.ebc} EBC · GU {m?.gu}</div>
            </div>
            <div style={{ width: 36, flexShrink: 0 }}>
              <div style={{ height: 3, background: T.b1, borderRadius: 2, marginBottom: 2 }}>
                <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: tm?.color || T.amber, borderRadius: 2, minWidth: pct > 0 ? 2 : 0 }} />
              </div>
              <div style={{ fontFamily: T.mono, color: tm?.color || T.amber, fontSize: 8, textAlign: 'right' }}>{pct.toFixed(0)}%</div>
            </div>
            <div style={{ width: 74, flexShrink: 0 }}>
              <NumInput value={g.kg} unit="kg" min={0.05} max={50} step={0.1} onChange={v => updGrain(g.id, v)} small />
            </div>
            <button onClick={() => remGrain(g.id)} style={remBtn} title="Remover">✕</button>
          </div>
        );
      })}
    </div>
  );
}
