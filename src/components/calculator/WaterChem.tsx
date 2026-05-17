'use client';
import { T, card } from '@/lib/tokens';
import { WaterSource, SaltAdditions, WaterTarget } from '@/lib/types';
import { NumInput } from '@/components/ui/NumInput';
import { calcAdjustedWater, autoWaterSalts } from '@/lib/brewing-math';
import { SOURCE_PRESETS, STYLE_TARGETS, styleToTarget } from '@/data/water-profiles';
import { useState, useMemo } from 'react';

interface WaterChemProps {
  source: WaterSource;
  setSource: (s: WaterSource) => void;
  salts: SaltAdditions;
  setSalts: (s: SaltAdditions) => void;
  mashL: number;
  styleId: string;
  styleCat: string;
}

// ─── Design tokens locais ───────────────────────────────────────────────────
const W  = '#1A6A9A';
const WL = 'rgba(26,106,154,0.08)';
const WB = 'rgba(26,106,154,0.18)';

const SECTION: React.CSSProperties = {
  background: WL,
  border: `1px solid ${WB}`,
  borderRadius: 10,
  padding: '12px 14px',
  marginBottom: 10,
};

const SEC_TITLE: React.CSSProperties = {
  fontFamily: T.mono, fontSize: 8, fontWeight: 600,
  letterSpacing: 2, textTransform: 'uppercase',
  color: W, marginBottom: 10,
};

const FIELD_LABEL: React.CSSProperties = {
  fontFamily: T.mono, color: T.inkDim, fontSize: 8,
  letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
};

const CHIP_BASE: React.CSSProperties = {
  fontFamily: T.mono, fontSize: 10, borderRadius: 20,
  padding: '4px 10px', border: `1px solid ${WB}`,
  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
};

// ─── Ions a exibir ──────────────────────────────────────────────────────────
const IONS: { key: keyof Omit<WaterSource,'ph'>; label: string; unit: string; ideal: string }[] = [
  { key: 'ca',   label: 'Cálcio',      unit: 'Ca',   ideal: '>50 ppm' },
  { key: 'mg',   label: 'Magnésio',    unit: 'Mg',   ideal: '5–30' },
  { key: 'na',   label: 'Sódio',       unit: 'Na',   ideal: '<150' },
  { key: 'hco3', label: 'Bicarbonato', unit: 'HCO₃', ideal: 'estilo' },
  { key: 'so4',  label: 'Sulfato',     unit: 'SO₄',  ideal: 'estilo' },
  { key: 'cl',   label: 'Cloreto',     unit: 'Cl',   ideal: 'estilo' },
];

const SALTS: { key: keyof SaltAdditions; label: string; desc: string; color: string }[] = [
  { key: 'gypsum', label: 'Gypsum',     desc: 'CaSO₄·2H₂O — Ca + SO₄', color: T.amber },
  { key: 'cacl2',  label: 'CaCl₂',      desc: 'CaCl₂·2H₂O — Ca + Cl',  color: T.hop   },
  { key: 'epsom',  label: 'Sal de Epsom', desc: 'MgSO₄·7H₂O — Mg + SO₄', color: T.info  },
  { key: 'nacl',   label: 'Sal de coz.',  desc: 'NaCl — Na + Cl',         color: T.neutral },
  { key: 'nahco3', label: 'Bicarbonato', desc: 'NaHCO₃ — Na + HCO₃ ↑pH', color: T.copper },
];

function inTarget(v: number, range: [number,number]): 'ok' | 'near' | 'off' {
  if (v >= range[0] && v <= range[1]) return 'ok';
  const spread = range[1] - range[0];
  const slack  = Math.max(spread * 0.5, 20);
  if (v >= range[0] - slack && v <= range[1] + slack) return 'near';
  return 'off';
}

const STATUS_COLOR = { ok: T.ok, near: T.wheat, off: T.ng };
const STATUS_ICON  = { ok: '✓', near: '~', off: '✗' };

export function WaterChem({ source, setSource, salts, setSalts, mashL, styleId, styleCat }: WaterChemProps) {
  const [open, setOpen]         = useState(false);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);

  const autoTarget = useMemo(() => styleToTarget(styleId, styleCat), [styleId, styleCat]);
  const target: WaterTarget = targetIdx !== null ? STYLE_TARGETS[targetIdx] : autoTarget;

  const adjusted = useMemo(
    () => calcAdjustedWater(source, salts, mashL),
    [source, salts, mashL],
  );

  const upSrc = (k: keyof WaterSource, v: number) => setSource({ ...source, [k]: v });
  const upSlt = (k: keyof SaltAdditions, v: number) => setSalts({ ...salts, [k]: v });

  const handleAuto = () => setSalts(autoWaterSalts(source, target, mashL));

  // ─── Summary for collapsed header ────────────────────────────────────────
  const hasSalts = Object.values(salts).some(v => v > 0);
  const summary  = hasSalts
    ? `Ca ${adjusted.ca.toFixed(0)} · SO₄ ${adjusted.so4.toFixed(0)} · Cl ${adjusted.cl.toFixed(0)}`
    : 'configurar';

  return (
    <div style={{ ...card, marginBottom: 20 }}>

      {/* ─── Header colapsável ──────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: 0, gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💧</span>
          <span style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 700, color: T.ink }}>
            Ajuste de Água
          </span>
          {!open && (
            <span style={{ fontFamily: T.mono, fontSize: 10, color: W, background: WL, border: `1px solid ${WB}`, borderRadius: 20, padding: '2px 9px' }}>
              {summary}
            </span>
          )}
        </div>
        <span style={{ fontFamily: T.mono, fontSize: 12, color: T.inkMuted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          ▾
        </span>
      </button>

      {!open && (
        <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 10, marginTop: 6, lineHeight: 1.5 }}>
          Sais para a água de mossagem · lavagem sem ajuste
        </div>
      )}

      {open && (
        <div style={{ marginTop: 16 }}>

          {/* ─── Seção 1: Água de Origem ──────────────────────────── */}
          <div style={SECTION}>
            <div style={SEC_TITLE}>Água de Origem (ppm)</div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {SOURCE_PRESETS.map(p => (
                <button key={p.short}
                  onClick={() => setSource(p.w)}
                  style={{
                    ...CHIP_BASE,
                    background: JSON.stringify(source) === JSON.stringify(p.w) ? W : 'transparent',
                    color:      JSON.stringify(source) === JSON.stringify(p.w) ? 'white' : W,
                  }}
                >
                  {p.short}
                </button>
              ))}
            </div>

            {/* Ion inputs 2×3 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px', marginBottom: 8 }}>
              {IONS.map(({ key, label, unit }) => (
                <div key={key}>
                  <div style={FIELD_LABEL}>{unit} · {label}</div>
                  <NumInput value={source[key]} min={0} max={500} step={1}
                    unit="ppm" onChange={v => upSrc(key, v)} small />
                </div>
              ))}
            </div>

            {/* pH */}
            <div style={{ width: '50%' }}>
              <div style={FIELD_LABEL}>pH da água</div>
              <NumInput value={source.ph} min={4} max={10} step={0.1} onChange={v => upSrc('ph', v)} small />
            </div>
          </div>

          {/* ─── Seção 2: Perfil Alvo ─────────────────────────────── */}
          <div style={SECTION}>
            <div style={SEC_TITLE}>Perfil Alvo · {target.name}</div>

            {/* Perfil presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <button
                onClick={() => setTargetIdx(null)}
                style={{
                  ...CHIP_BASE,
                  background: targetIdx === null ? W : 'transparent',
                  color:      targetIdx === null ? 'white' : W,
                  fontSize: 9,
                }}
              >
                Auto ({autoTarget.name.split(' ')[0]})
              </button>
              {STYLE_TARGETS.map((t, i) => (
                <button key={i}
                  onClick={() => setTargetIdx(i)}
                  style={{
                    ...CHIP_BASE,
                    background: targetIdx === i ? W : 'transparent',
                    color:      targetIdx === i ? 'white' : W,
                    fontSize: 9,
                  }}
                >
                  {t.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Faixas do alvo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
              {IONS.map(({ key, unit }) => {
                const range = target[key];
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, width: 30 }}>{unit}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, color: W }}>
                      {range[0]}–{range[1]}
                    </span>
                    <span style={{ fontFamily: T.mono, fontSize: 8, color: T.inkDim }}>ppm</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Seção 3: Adições de Sais ─────────────────────────── */}
          <div style={SECTION}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={SEC_TITLE}>Adições de Sais (gramas)</div>
              <button
                onClick={handleAuto}
                style={{
                  fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                  color: 'white', background: W, border: 'none',
                  borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
                  letterSpacing: 0.3,
                }}
              >
                ⚡ Auto
              </button>
            </div>

            <div style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 9, marginBottom: 10 }}>
              Mossagem: <b style={{ color: W }}>{mashL.toFixed(1)} L</b>
              {mashL <= 0 && <span style={{ color: T.ng }}> · configure o equipamento primeiro</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px' }}>
              {SALTS.map(({ key, label, desc, color }) => (
                <div key={key}>
                  <div style={{ ...FIELD_LABEL, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                    {label}
                  </div>
                  <NumInput value={salts[key]} min={0} max={50} step={0.1}
                    unit="g" onChange={v => upSlt(key, v)} small />
                  <div style={{ fontFamily: T.mono, fontSize: 7.5, color: T.inkDim, marginTop: 2 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Seção 4: Resultado ───────────────────────────────── */}
          <div style={{ ...SECTION, marginBottom: 0 }}>
            <div style={SEC_TITLE}>Resultado da Mossagem (ppm)</div>

            {/* Cabeçalho da tabela */}
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 64px 64px 28px',
              gap: 6, alignItems: 'center',
              fontFamily: T.mono, fontSize: 7, color: T.inkDim,
              letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 6, paddingBottom: 6,
              borderBottom: `1px solid ${WB}`,
            }}>
              <span>Íon</span>
              <span>Faixa alvo</span>
              <span style={{ textAlign: 'right' }}>Origem</span>
              <span style={{ textAlign: 'right' }}>Ajustado</span>
              <span />
            </div>

            {IONS.map(({ key, unit }) => {
              const src = source[key];
              const adj = adjusted[key];
              const range = target[key];
              const status = inTarget(adj, range);
              const barPct = Math.min(100, (adj / (range[1] * 1.5 || 1)) * 100);
              const targetMidPct = Math.min(100, ((range[0] + range[1]) / 2) / (range[1] * 1.5 || 1) * 100);

              return (
                <div key={key} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 64px 64px 28px',
                  gap: 6, alignItems: 'center',
                  marginBottom: 8,
                }}>
                  {/* Nome */}
                  <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, color: T.inkMid }}>{unit}</span>

                  {/* Barra visual */}
                  <div>
                    <div style={{ position: 'relative', height: 5, background: `${WB}`, borderRadius: 3 }}>
                      {/* zona alvo */}
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(100, (range[0] / (range[1] * 1.5 || 1)) * 100)}%`,
                        width: `${Math.min(100 - (range[0] / (range[1] * 1.5 || 1)) * 100, ((range[1] - range[0]) / (range[1] * 1.5 || 1)) * 100)}%`,
                        height: '100%', background: `${T.ok}44`, borderRadius: 3,
                      }} />
                      {/* valor ajustado */}
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(98, barPct)}%`,
                        top: -1.5, width: 8, height: 8,
                        borderRadius: '50%',
                        background: STATUS_COLOR[status],
                        transform: 'translateX(-50%)',
                        border: '1.5px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                      }} />
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 7.5, color: T.inkDim, marginTop: 2 }}>
                      {range[0]}–{range[1]} ppm
                    </div>
                  </div>

                  {/* Origem */}
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.inkDim, textAlign: 'right' }}>
                    {src.toFixed(0)}
                  </span>

                  {/* Ajustado */}
                  <span style={{
                    fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                    color: STATUS_COLOR[status], textAlign: 'right',
                  }}>
                    {adj.toFixed(0)}
                  </span>

                  {/* Status */}
                  <span style={{
                    fontFamily: T.mono, fontSize: 11,
                    color: STATUS_COLOR[status], textAlign: 'center',
                  }}>
                    {STATUS_ICON[status]}
                  </span>
                </div>
              );
            })}

            {/* Razão SO4/Cl */}
            {adjusted.cl > 0 && (
              <div style={{
                marginTop: 6, paddingTop: 8, borderTop: `1px solid ${WB}`,
                fontFamily: T.mono, fontSize: 9, color: T.inkMuted,
                display: 'flex', gap: 16,
              }}>
                <span>SO₄/Cl: <b style={{ color: W }}>{(adjusted.so4 / adjusted.cl).toFixed(1)}</b></span>
                <span style={{ color: T.inkDim }}>
                  {adjusted.so4 / adjusted.cl > 1.5 ? '→ perfil amargo/seco' :
                   adjusted.so4 / adjusted.cl < 0.7 ? '→ perfil macio/maltoso' :
                   '→ perfil equilibrado'}
                </span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
