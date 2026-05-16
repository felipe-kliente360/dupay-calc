'use client';
import { T, card } from '@/lib/tokens';
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

const midAA = (hopId: number) => {
  const h = HOPS_DB.find(x => x.id === hopId);
  return h ? parseFloat(((h.aa[0] + h.aa[1]) / 2).toFixed(1)) : 5.0;
};

const SEL: React.CSSProperties = {
  background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 8,
  color: T.ink, padding: '9px 10px', fontSize: 12, fontFamily: T.body,
  outline: 'none', cursor: 'pointer', width: '100%', height: 36,
};
const FIELD_LABEL: React.CSSProperties = {
  fontFamily: T.mono, color: T.inkDim, fontSize: 8,
  letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
};
const ADD_BTN: React.CSSProperties = {
  height: 36, borderRadius: 8, border: 'none',
  background: T.hop, color: 'white', cursor: 'pointer',
  fontFamily: T.mono, fontWeight: 700, fontSize: 12, letterSpacing: 0.4,
  whiteSpace: 'nowrap', flex: 1,
  boxShadow: '0 2px 8px rgba(86,120,40,.28)',
};
const DEL_BTN: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%',
  background: 'none', border: `1.5px solid ${T.b2}`,
  color: T.inkMuted, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 12, fontFamily: T.mono, flexShrink: 0, lineHeight: 1,
};

const HOP_FIELDS = [
  { label: 'Qtd.',  field: 'g'    as const, unit: 'g',   min: 0,   max: 500, step: 5   },
  { label: 'Tempo', field: 'time' as const, unit: 'min', min: 0,   max: 120, step: 5   },
  { label: 'AA%',   field: 'aa'   as const, unit: '%',   min: 0.5, max: 30,  step: 0.1 },
];

export function HopSchedule({ hops, setHops, ibu, boilOG, batchL }: HopScheduleProps) {
  const [newHopId, setNewHopId] = useState(1);
  const [newAA, setNewAA]       = useState(() => midAA(1));

  const handleHopChange = (id: number) => { setNewHopId(id); setNewAA(midAA(id)); };
  const addHop  = () => setHops(h => [...h, { id: Date.now(), hopId: newHopId, g: 20, time: 60, aa: newAA }]);
  const remHop  = (id: number) => setHops(h => h.filter(x => x.id !== id));
  const updHop  = (id: number, f: keyof HopEntry, v: number) => setHops(h => h.map(x => x.id === id ? { ...x, [f]: v } : x));

  return (
    <div style={{ ...card }}>
      <SectionHead title="🌿 Lúpulos" info={ibu > 0 ? `${ibu.toFixed(0)} IBU` : ''} />

      {/* Zona de adição */}
      <div style={{
        background: T.bgHop, borderRadius: 10, padding: '12px 14px',
        border: `1px solid ${T.b1}`, marginBottom: 14,
      }}>
        {/* Linha 1: select */}
        <div style={{ marginBottom: 10 }}>
          <div style={FIELD_LABEL}>Lúpulo</div>
          <select value={newHopId} onChange={e => handleHopChange(Number(e.target.value))} style={SEL}>
            {HOPS_DB.map(h => <option key={h.id} value={h.id}>{h.name} ({h.origin})</option>)}
          </select>
        </div>
        {/* Linha 2: AA% + botão */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ width: 88 }}>
            <div style={FIELD_LABEL}>AA%</div>
            <NumInput value={newAA} min={0.5} max={30} step={0.1} onChange={setNewAA} small />
          </div>
          <button onClick={addHop} style={ADD_BTN}>+ Lúpulo</button>
        </div>
      </div>

      {/* Lista vazia */}
      {hops.length === 0 && (
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkDim, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Nenhum lúpulo adicionado. Tempo 0 = dry-hop.
        </div>
      )}

      {/* Linhas de lúpulo */}
      {hops.map(h => {
        const hp       = HOPS_DB.find(x => x.id === h.hopId);
        const hopIBU   = (h.g * h.aa * calcUtilization(h.time, boilOG) * 10) / (batchL || 20);
        const isDryHop = h.time === 0;

        return (
          <div key={h.id} style={{
            background: T.bgHop,
            borderRadius: 10, border: `1px solid ${T.b1}`,
            marginBottom: 6, overflow: 'hidden',
          }}>
            {/* Linha 1: nome + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 6px 12px' }}>
              <div style={{ width: 3, alignSelf: 'stretch', minHeight: 28, borderRadius: 2, background: T.hop, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: T.body, color: T.ink, fontSize: 13, fontWeight: 600 }}>{hp?.name}</span>
                  <span style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9 }}>{hp?.origin}</span>
                </div>
                <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, marginTop: 3 }}>
                  {isDryHop
                    ? <span style={{ color: T.hop, fontWeight: 600 }}>Dry-hop</span>
                    : <><b style={{ color: T.hop }}>{hopIBU.toFixed(1)} IBU</b> · </>
                  }
                  {hp?.flavor}
                </div>
              </div>
            </div>

            {/* Linha 2: inputs + excluir */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 12px 10px 23px' }}>
              {HOP_FIELDS.map(({ label, field, unit, min, max, step }) => (
                <div key={field} style={{ flex: 1 }}>
                  <div style={FIELD_LABEL}>{label}</div>
                  <NumInput
                    value={h[field] as number}
                    unit={unit} min={min} max={max} step={step}
                    onChange={v => updHop(h.id, field, v)}
                    small
                  />
                </div>
              ))}
              <button onClick={() => remHop(h.id)} style={DEL_BTN} title="Remover">✕</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
