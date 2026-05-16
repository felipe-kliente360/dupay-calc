'use client';
import { T, card } from '@/lib/tokens';
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

const defaultEBC = (id: number) => MALTS_DB.find(x => x.id === id)?.ebc ?? 3;

// ── Estilos compartilhados ─────────────────────────────────────────────────
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
  background: T.amber, color: 'white', cursor: 'pointer',
  fontFamily: T.mono, fontWeight: 600, fontSize: 11, letterSpacing: 0.4,
  whiteSpace: 'nowrap', flexShrink: 0,
  boxShadow: '0 2px 8px rgba(184,114,16,.28)',
};
const DEL_BTN: React.CSSProperties = {
  width: 28, height: 28, borderRadius: '50%',
  background: 'none', border: `1px solid ${T.b2}`,
  color: T.inkMuted, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 11, fontFamily: T.mono, flexShrink: 0,
};

// ── Componente de campo com label ──────────────────────────────────────────
function LabeledInput({ label, width, children }: { label: string; width: number; children: React.ReactNode }) {
  return (
    <div style={{ width, flexShrink: 0 }}>
      <div style={FIELD_LABEL}>{label}</div>
      {children}
    </div>
  );
}

export function GrainBill({ grains, setGrains, totalKg }: GrainBillProps) {
  const [newMaltId, setNewMaltId] = useState(1);
  const [newEBC, setNewEBC]       = useState(() => defaultEBC(1));

  const handleMaltChange = (id: number) => { setNewMaltId(id); setNewEBC(defaultEBC(id)); };
  const addGrain  = () => {
    const m = MALTS_DB.find(x => x.id === newMaltId);
    const ebcOverride = m && newEBC !== m.ebc ? newEBC : undefined;
    setGrains(g => [...g, { id: Date.now(), maltId: newMaltId, kg: 1.0, ebc: ebcOverride }]);
  };
  const remGrain  = (id: number) => setGrains(g => g.filter(x => x.id !== id));
  const updKg     = (id: number, kg: number)  => setGrains(g => g.map(x => x.id === id ? { ...x, kg }  : x));
  const updEBC    = (id: number, ebc: number) => setGrains(g => g.map(x => x.id === id ? { ...x, ebc } : x));
  const resetEBC  = (id: number) => setGrains(g => g.map(x => x.id === id ? { ...x, ebc: undefined } : x));

  return (
    <div style={{ ...card }}>
      <SectionHead title="🌾 Maltes" info={totalKg > 0 ? `${totalKg.toFixed(2)} kg` : ''} />

      {/* Zona de adição */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap',
        background: T.bgAmber, borderRadius: 10, padding: '12px 14px',
        border: `1px solid ${T.b1}`, marginBottom: 14,
      }}>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={FIELD_LABEL}>Malte</div>
          <select value={newMaltId} onChange={e => handleMaltChange(Number(e.target.value))} style={SEL}>
            {(['base','crystal','roasted','adjunct'] as const).map(t => (
              <optgroup key={t} label={MALT_TYPE[t].label}>
                {MALTS_DB.filter(m => m.type === t).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <LabeledInput label="EBC" width={72}>
          <NumInput value={newEBC} min={1} max={2000} step={5} onChange={setNewEBC} small />
        </LabeledInput>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={addGrain} style={ADD_BTN}>+ Malte</button>
        </div>
      </div>

      {/* Lista vazia */}
      {grains.length === 0 && (
        <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkDim, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Nenhum malte adicionado.
        </div>
      )}

      {/* Linhas de malte */}
      {grains.map(g => {
        const m      = MALTS_DB.find(x => x.id === g.maltId);
        const tm     = m ? MALT_TYPE[m.type] : null;
        const pct    = totalKg > 0 ? (g.kg / totalKg * 100) : 0;
        const ebcVal = g.ebc ?? m?.ebc ?? 0;
        const isCustomEBC = g.ebc !== undefined && g.ebc !== m?.ebc;

        return (
          <div key={g.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: tm?.bg || T.bgRow,
            borderRadius: 10, border: `1px solid ${T.b1}`,
            marginBottom: 6,
          }}>
            {/* Barra de cor do tipo */}
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: tm?.color || T.b2, flexShrink: 0 }} />

            {/* Nome + info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: T.body, color: T.ink, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{m?.name}</span>
                <Pill color={tm?.color || T.inkMuted}>{tm?.label}</Pill>
              </div>
              <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginTop: 3 }}>
                GU {m?.gu}
              </div>
            </div>

            {/* Barra de percentual */}
            <div style={{ width: 38, flexShrink: 0, textAlign: 'right' }}>
              <div style={{ height: 3, background: T.b1, borderRadius: 2, marginBottom: 3 }}>
                <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: tm?.color || T.amber, borderRadius: 2, minWidth: pct > 0 ? 2 : 0 }} />
              </div>
              <span style={{ fontFamily: T.mono, color: tm?.color || T.amber, fontSize: 8 }}>{pct.toFixed(0)}%</span>
            </div>

            {/* EBC */}
            <div style={{ width: 72, flexShrink: 0 }}>
              <div style={{ ...FIELD_LABEL, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>EBC</span>
                {isCustomEBC && (
                  <button onClick={() => resetEBC(g.id)} title="Resetar EBC"
                    style={{ background: 'none', border: 'none', color: T.amber, cursor: 'pointer', fontFamily: T.mono, fontSize: 8, padding: 0, lineHeight: 1 }}>↺</button>
                )}
              </div>
              <NumInput value={ebcVal} min={1} max={2000} step={5} onChange={v => updEBC(g.id, v)} small />
            </div>

            {/* Kg */}
            <div style={{ width: 76, flexShrink: 0 }}>
              <div style={FIELD_LABEL}>Kg</div>
              <NumInput value={g.kg} unit="kg" min={0.05} max={50} step={0.1} onChange={v => updKg(g.id, v)} small />
            </div>

            {/* Excluir */}
            <button onClick={() => remGrain(g.id)} style={DEL_BTN} title="Remover">✕</button>
          </div>
        );
      })}
    </div>
  );
}
