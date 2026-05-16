'use client';
import { T } from '@/lib/tokens';
import { EquipProfile, WaterCalc } from '@/lib/types';
import { NumInput } from '@/components/ui/NumInput';

interface EquipModalProps {
  equip: EquipProfile;
  onChange: (e: EquipProfile) => void;
  onClose: () => void;
  waterCalc: WaterCalc;
}

const GROUP_STYLE = {
  marginBottom: 20,
};

const GROUP_TITLE = {
  fontFamily: T.mono,
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  color: T.amber,
  marginBottom: 10,
  paddingBottom: 6,
  borderBottom: `1px solid ${T.b1}`,
};

const FIELD_LABEL = {
  fontFamily: T.mono,
  fontSize: 9,
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  color: T.inkMuted,
  marginBottom: 5,
};

const GRID2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px 16px',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={FIELD_LABEL}>{label}</div>
      {children}
    </div>
  );
}

export function EquipModal({ equip, onChange, onClose, waterCalc }: EquipModalProps) {
  const up = (k: keyof EquipProfile, v: number) => onChange({ ...equip, [k]: v });

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,12,4,.5)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        style={{
          background: T.bgCard,
          borderRadius: 16,
          border: `1px solid ${T.b2}`,
          padding: 28,
          width: 'min(460px, 94vw)',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 16px 56px rgba(0,0,0,.22)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>Perfil de Equipamento</div>
            <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 10, marginTop: 3, letterSpacing: 0.5 }}>
              Configurado uma vez · usado em todos os cálculos
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: `1px solid ${T.b2}`, borderRadius: 8, cursor: 'pointer', fontSize: 14, color: T.inkMuted, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
        </div>

        {/* Grupo 1: Volume e Eficiência */}
        <div style={GROUP_STYLE}>
          <div style={GROUP_TITLE}>🍺 Produção</div>
          <div style={GRID2}>
            <Field label="Volume final">
              <NumInput value={equip.batchL} unit="L" min={5} max={300} step={1} onChange={v => up('batchL', v)} />
            </Field>
            <Field label="Eficiência">
              <NumInput value={equip.efficiency} unit="%" min={40} max={100} step={1} onChange={v => up('efficiency', v)} />
            </Field>
          </div>
        </div>

        {/* Grupo 2: Fervura */}
        <div style={GROUP_STYLE}>
          <div style={GROUP_TITLE}>🔥 Fervura</div>
          <div style={GRID2}>
            <Field label="Duração">
              <NumInput value={equip.boilMin} unit="min" min={15} max={180} step={5} onChange={v => up('boilMin', v)} />
            </Field>
            <Field label="Taxa de evaporação">
              <NumInput value={equip.boiloffLh} unit="L/h" min={0} max={15} step={0.5} onChange={v => up('boiloffLh', v)} />
            </Field>
          </div>
        </div>

        {/* Grupo 3: Perdas */}
        <div style={GROUP_STYLE}>
          <div style={GROUP_TITLE}>💧 Perdas de volume</div>
          <div style={GRID2}>
            <Field label="Espaço morto">
              <NumInput value={equip.deadSpace} unit="L" min={0} max={10} step={0.5} onChange={v => up('deadSpace', v)} />
            </Field>
            <Field label="Trub / chiller">
              <NumInput value={equip.trubLoss} unit="L" min={0} max={10} step={0.5} onChange={v => up('trubLoss', v)} />
            </Field>
            <Field label="Absorção do malte">
              <NumInput value={equip.absorptionLkg} unit="L/kg" min={0.5} max={2} step={0.1} onChange={v => up('absorptionLkg', v)} />
            </Field>
          </div>
        </div>

        {/* Volumes calculados */}
        <div style={{ background: T.bgAmber, borderRadius: 12, padding: 16, border: `1px solid ${T.b1}`, marginBottom: 20 }}>
          <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 9, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>💧 Volumes Calculados</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            {([
              ['Pré-fervura',      `${waterCalc.preBoil.toFixed(1)} L`],
              ['Total de água',    `${waterCalc.totalWater.toFixed(1)} L`],
              ['Água de mossagem', `${waterCalc.mashWater.toFixed(1)} L`],
              ['Água de lavagem',  `${waterCalc.spargeWater.toFixed(1)} L`],
            ] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ background: T.bgCard, borderRadius: 8, padding: '10px 12px', border: `1px solid ${T.b1}` }}>
                <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 0.5, marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: T.mono, color: T.amber, fontWeight: 600, fontSize: 16 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
            Mossagem a 3 L/kg · absorção {waterCalc.absorption.toFixed(1)} L · espaço morto {waterCalc.deadSpace.toFixed(1)} L
          </div>
        </div>

        <button onClick={onClose} style={{
          width: '100%',
          background: `linear-gradient(135deg, ${T.amber}, ${T.amberD})`,
          border: 'none', color: 'white',
          padding: '13px',
          borderRadius: 10, cursor: 'pointer',
          fontFamily: T.serif, fontWeight: 700, fontSize: 15, letterSpacing: 0.5,
          boxShadow: '0 4px 16px rgba(184,114,16,.3)',
        }}>
          Salvar e Fechar
        </button>
      </div>
    </div>
  );
}
