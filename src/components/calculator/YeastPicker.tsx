'use client';
import { T } from '@/lib/tokens';
import { YEASTS_DB } from '@/data/yeasts';
import { Pill } from '@/components/ui/Pill';
import { SectionHead } from '@/components/ui/SectionHead';
import { calcFG } from '@/lib/brewing-math';

interface YeastPickerProps {
  yeastId: number;
  setYeastId: (id: number) => void;
  customAtten: number | null;
  setCustomAtten: (a: number | null) => void;
  avgAtten: number;
  og: number;
}

export function YeastPicker({ yeastId, setYeastId, customAtten, setCustomAtten, avgAtten, og }: YeastPickerProps) {
  const yeast = YEASTS_DB.find(y => y.id === yeastId);
  const sel = { background: T.bgInput, border: `1.5px solid ${T.b1}`, borderRadius: 6, color: T.ink, padding: '9px 12px', fontSize: 13, fontFamily: T.body, width: '100%', outline: 'none', cursor: 'pointer' };

  return (
    <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.b1}`, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
      <SectionHead title="🧫 Levedura" />
      <select
        value={yeastId}
        onChange={e => { setYeastId(Number(e.target.value)); setCustomAtten(null); }}
        style={{ ...sel, marginBottom: yeast ? 10 : 0 }}
      >
        <optgroup label="── Fermentis ──">
          {YEASTS_DB.filter(y => y.brand === 'fermentis').map(y => <option key={y.id} value={y.id}>[{y.code}] {y.name}</option>)}
        </optgroup>
        <optgroup label="── Lallemand ──">
          {YEASTS_DB.filter(y => y.brand === 'lallemand').map(y => <option key={y.id} value={y.id}>[{y.code}] {y.name}</option>)}
        </optgroup>
      </select>
      {yeast && (
        <div>
          <div style={{ fontFamily: T.body, fontStyle: 'italic', color: T.inkMid, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{yeast.desc}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            <Pill color={yeast.brand === 'fermentis' ? T.amber : T.info}>{yeast.brand === 'fermentis' ? 'Fermentis' : 'Lallemand'}</Pill>
            <Pill color={T.special}>{yeast.type}</Pill>
            <Pill color={T.info}>{yeast.temp[0]}–{yeast.temp[1]}°C</Pill>
            <Pill color={T.copper}>Floc. {yeast.floc}</Pill>
          </div>
          <div style={{ background: T.bgMuted, borderRadius: 8, padding: '12px 14px', border: `1px solid ${T.b1}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: T.mono, color: T.inkMuted, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>Atenuação</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.inkDim, background: T.bgCard, border: `1px solid ${T.b1}`, borderRadius: 4, padding: '1px 6px' }}>
                  {yeast.atten[0]}–{yeast.atten[1]}%
                </span>
                <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 600, color: T.amber, minWidth: 44, textAlign: 'right' }}>
                  {avgAtten.toFixed(1)}%
                </span>
                {customAtten !== null && (
                  <button onClick={() => setCustomAtten(null)} style={{ background: 'none', border: `1px solid ${T.b2}`, borderRadius: 4, padding: '1px 6px', cursor: 'pointer', fontFamily: T.mono, fontSize: 9, color: T.inkMuted }}>
                    reset
                  </button>
                )}
              </div>
            </div>
            <input
              type="range"
              min={yeast.atten[0]} max={yeast.atten[1]} step={0.5}
              value={avgAtten}
              onChange={e => setCustomAtten(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: T.amber, cursor: 'pointer', height: 4 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 8 }}>{yeast.atten[0]}%</span>
              <span style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 8, textAlign: 'center' }}>
                FG estimada: <b style={{ color: T.amber }}>{calcFG(og, avgAtten).toFixed(3)}</b>
              </span>
              <span style={{ fontFamily: T.mono, color: T.inkDim, fontSize: 8 }}>{yeast.atten[1]}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
