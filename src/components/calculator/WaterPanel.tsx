'use client';
import { T } from '@/lib/tokens';
import { WaterCalc } from '@/lib/types';

interface WaterPanelProps {
  waterCalc: WaterCalc;
  totalGrainKg: number;
}

export function WaterPanel({ waterCalc, totalGrainKg }: WaterPanelProps) {
  if (totalGrainKg <= 0) return null;
  const items: [string, string, string][] = [
    ["💧 Água de mossagem", `${waterCalc.mashWater.toFixed(1)} L`,  T.info ],
    ["🚿 Água de lavagem",  `${waterCalc.spargeWater.toFixed(1)} L`,T.info ],
    ["🪣 Total de água",    `${waterCalc.totalWater.toFixed(1)} L`, T.amber],
    ["🍺 Pré-fervura",      `${waterCalc.preBoil.toFixed(1)} L`,   T.hop  ],
  ];
  return (
    <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.b1}`, padding: 16, marginBottom: 18 }}>
      <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 12 }}>💧 Volumes de Água</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map(([l, v, c]) => (
          <div key={l} style={{ background: T.bgAmber, borderRadius: 8, padding: '10px 12px', border: `1px solid ${T.b1}` }}>
            <div style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: .8, marginBottom: 3 }}>{l}</div>
            <div style={{ fontFamily: T.mono, color: c, fontSize: 16, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMuted, fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
        Mossagem: 3 L/kg + espaço morto {waterCalc.deadSpace.toFixed(1)} L · absorção: {waterCalc.absorption.toFixed(1)} L · trub: {waterCalc.trubLoss.toFixed(1)} L
      </div>
    </div>
  );
}
