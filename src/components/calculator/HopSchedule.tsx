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

// ── Estilos compartilhados (mesmos do GrainBill) ───────────────────────────
const SEL: React.CSSProperties = {
  background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 8,
  color: T.ink, padding: '9px 10px', fontSize: 12, fontFamily: T.body,
  outline: 'none', cursor: 'pointer', flex: 1, minWidth: 0, height: 36,
};
const FIELD_LABEL: React.CSSProperties = {
  fontFamily: T.mono, color: T.inkDim, fontSize: 8,
  letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
};
const ADD_BTN: React.CSSProperties = {
  height: 36, padding: '0 18px', borderRadius: 8, border: 'none',
  background: T.hop, color: 'white', cursor: 'pointer',
  fontFamily: T.mono, fontWeight: 600, fontSize: 11, letterSpacing: 0.4,
  whiteSpace: 'nowrap', flexShrink: 0,
  boxShadow: '0 2px 8px rgba(86,120,40,.28)',
};
const DEL_BTN: React.CSSProperties = {
  width: 28, height: 28, borderRadius: '50%',
  background: 'none', border: `1px solid ${T.b2}`,
  color: T.inkMuted, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 11, fontFamily: T.mono, flexShrink: 0,
};

const HOP_FIELDS = [
  { label: 'Qtd.',  field: 'g'    as const, unit: 'g',   min: 0,   max: 500, step: 5,   width: 68 },
  { label: 'Tempo', field: 'time' as const, unit: 'min', min: 0,   max: 120, step: 5,   width: 68 },
  { label: 'AA%',   field: 'aa'   as const, unit: '%',   min: 0.5, max: 30,  step: 0.1, width: 60 },
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
        display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap',
        background: T.bgHop, borderRadius: 10, padding: '12px 14px',
        border: `1px solid ${T.b1}`, marginBottom: 14,
      }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={FIELD_LABEL}>Lúpulo</div>
          <select value={newHopId} onChange={e => handleHopChange(Number(e.target.value))} style={SEL}>
            {HOPS_DB.map(h => <option key={h.id} value={h.id}>{h.name} ({h.origin})</option>)}
          </select>
        </div>
        <div style={{ width: 72, flexShrink: 0 }}>
          <div style={FIELD_LABEL}>AA%</div>
          <NumInput value={newAA} min={0.5} max={30} step={0.1} onChange={setNewAA} small />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
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
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: T.bgHop,
            borderRadius: 10, border: `1px solid ${T.b1}`,
            marginBottom: 6, flexWrap: 'wrap',
          }}>
            {/* Barra de cor */}
            <div style={{ width: 3, alignSelf: 'stretch', minHeight: 32, borderRadius: 2, background: T.hop, flexShrink: 0 }} />

            {/* Nome + info */}
            <div style={{ flex: '1 1 120px', minWidth: 0 }}>
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

            {/* Campos numéricos */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
              {HOP_FIELDS.map(({ label, field, unit, min, max, step, width }) => (
                <div key={field} style={{ width }}>
                  <div style={FIELD_LABEL}>{label}</div>
                  <NumInput
                    value={h[field] as number}
                    unit={unit} min={min} max={max} step={step}
                    onChange={v => updHop(h.id, field, v)}
                    small
                  />
                </div>
              ))}
            </div>

            {/* Excluir */}
            <button onClick={() => remHop(h.id)} style={DEL_BTN} title="Remover">✕</button>
          </div>
        );
      })}
    </div>
  );
}
