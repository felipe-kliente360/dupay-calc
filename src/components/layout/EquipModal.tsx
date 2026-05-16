'use client';
import { T } from '@/lib/tokens';
import { EquipProfile, WaterCalc } from '@/lib/types';
import { NumInput } from '@/components/ui/NumInput';
import { SField } from '@/components/ui/SField';

const FIELDS: [string, keyof EquipProfile, string, number, number, number][] = [
  ["Volume no fermentador",  "batchL",        "L",   5,   300, 1  ],
  ["Eficiência da brassagem","efficiency",    "%",   40,  100, 1  ],
  ["Tempo de fervura",       "boilMin",       "min", 15,  180, 5  ],
  ["Taxa de evaporação",     "boiloffLh",     "L/h", 0,   15,  0.5],
  ["Espaço morto na mostura","deadSpace",     "L",   0,   10,  0.5],
  ["Perda no trub/chiller",  "trubLoss",      "L",   0,   10,  0.5],
  ["Absorção do malte",      "absorptionLkg", "L/kg",0.5, 2,   0.1],
];

interface EquipModalProps {
  equip: EquipProfile;
  onChange: (e: EquipProfile) => void;
  onClose: () => void;
  waterCalc: WaterCalc;
}

export function EquipModal({ equip, onChange, onClose, waterCalc }: EquipModalProps) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,12,4,.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: T.bgCard, borderRadius: 14, border: `1px solid ${T.b2}`, padding: 24, width: 'min(440px,92vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 48px rgba(0,0,0,.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 17, fontWeight: 700, color: T.ink }}>Perfil de Equipamento</div>
            <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 10, marginTop: 2 }}>Configurado uma vez — usado em todos os cálculos</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.inkMuted }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {FIELDS.map(([lbl, f, u, mn, mx, st]) => (
            <SField key={f} label={lbl}>
              <NumInput value={equip[f] as number} unit={u} min={mn} max={mx} step={st} onChange={v => onChange({ ...equip, [f]: v })} />
            </SField>
          ))}
        </div>

        <div style={{ background: T.bgAmber, borderRadius: 10, padding: 14, border: `1px solid ${T.b2}` }}>
          <div style={{ fontFamily: T.mono, color: T.amber, fontSize: 9, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>💧 Volumes Calculados</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              ["Pré-fervura",     `${waterCalc.preBoil.toFixed(1)} L`],
              ["Total de água",   `${waterCalc.totalWater.toFixed(1)} L`],
              ["Água de mossagem",`${waterCalc.mashWater.toFixed(1)} L`],
              ["Água de lavagem", `${waterCalc.spargeWater.toFixed(1)} L`],
            ] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ background: 'white', borderRadius: 7, padding: '8px 10px', border: `1px solid ${T.b1}` }}>
                <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: .8 }}>{l}</div>
                <div style={{ fontFamily: T.mono, color: T.amber, fontWeight: 500, fontSize: 15, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, marginTop: 10 }}>
            * Mossagem a 3 L/kg de malte. Ajuste sparge conforme espessura desejada.
          </div>
        </div>

        <button onClick={onClose} style={{ marginTop: 16, width: '100%', background: `linear-gradient(135deg,${T.amber},${T.amberD})`, border: 'none', color: 'white', padding: '11px', borderRadius: 8, cursor: 'pointer', fontFamily: T.serif, fontWeight: 700, fontSize: 14, letterSpacing: .5 }}>
          Salvar e Fechar
        </button>
      </div>
    </div>
  );
}
